# 

#!/usr/bin/env bash

set -eou pipefail

PREFER_PODMAN=0
CREATE_ENV=0
USE_LOCAL_PROXY=1
TEMPO_HOST=0
PLUGIN_PORT=9001

while getopts "epcl:" flag; do
    case $flag in
        e) CREATE_ENV=1;;
        p) PREFER_PODMAN=1;;
        c) USE_LOCAL_PROXY=0;;
        l) TEMPO_HOST=$OPTARG;;
        l) PLUGIN_PORT=$OPTARG;;
        \?) echo "Invalid option: -$flag" 
            exit;;
    esac
done

if [[ -x "$(command -v podman)" && $PREFER_PODMAN == 1 ]]; then
    if [ "$(uname -s)" = "Linux" ]; then
        INTERNAL_HOST="http://localhost"
    else
        INTERNAL_HOST="http://host.containers.internal"
    fi
else
    INTERNAL_HOST="http://host.docker.internal"
fi

if [[ $TEMPO_HOST == 0 ]]; then
    TEMPO_HOST="$INTERNAL_HOST:3200"
fi

CONSOLE_IMAGE=${CONSOLE_IMAGE:="quay.io/openshift/origin-console:latest"}
CONSOLE_PORT=${CONSOLE_PORT:=9000}

function createEnvironment(){
    echo "Creating env file..."
    touch scripts/env.list

    BRIDGE_USER_AUTH="disabled"
    echo BRIDGE_USER_AUTH=$BRIDGE_USER_AUTH > scripts/env.list

    BRIDGE_K8S_MODE="off-cluster"
    echo BRIDGE_K8S_MODE=$BRIDGE_K8S_MODE >> scripts/env.list

    BRIDGE_K8S_AUTH="bearer-token"
    echo BRIDGE_K8S_AUTH=$BRIDGE_K8S_AUTH >> scripts/env.list

    BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=true
    echo BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=$BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS >> scripts/env.list

    BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=$(oc whoami --show-server)
    echo BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=$BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT >> scripts/env.list

    THANOS_URL=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath=\"{.data.thanosPublicURL}\")
    BRIDGE_K8S_MODE_OFF_CLUSTER_THANOS=${THANOS_URL/\/api/""}
    echo BRIDGE_K8S_MODE_OFF_CLUSTER_THANOS=$BRIDGE_K8S_MODE_OFF_CLUSTER_THANOS | sed 's/"//g' >> scripts/env.list

    ALERTMANAGER_URL=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath=\"{.data.alertmanagerPublicURL}\")
    BRIDGE_K8S_MODE_OFF_CLUSTER_ALERTMANAGER=${ALERTMANAGER_URL/\/api/""}
    echo BRIDGE_K8S_MODE_OFF_CLUSTER_ALERTMANAGER=$BRIDGE_K8S_MODE_OFF_CLUSTER_ALERTMANAGER | sed 's/"//g' >> scripts/env.list

    BRIDGE_K8S_AUTH_BEARER_TOKEN=$(oc whoami --show-token 2>/dev/null)
    echo BRIDGE_K8S_AUTH_BEARER_TOKEN=$BRIDGE_K8S_AUTH_BEARER_TOKEN >> scripts/env.list

    BRIDGE_USER_SETTINGS_LOCATION="localstorage"
    echo BRIDGE_USER_SETTINGS_LOCATION=$BRIDGE_USER_SETTINGS_LOCATION >> scripts/env.list

    BRIDGE_PLUGIN_PROXY="{\"services\": [{\"consoleAPIPath\": \"/api/proxy/plugin/distributed-tracing-plugin/backend/\", \"authorize\": true, \"endpoint\": \"https://prometheus.demo.do.prometheus.io\"}]}"
    if [[ $USE_LOCAL_PROXY == 1 ]]; then
        echo "Using local proxy"
        echo BRIDGE_PLUGIN_PROXY=$BRIDGE_PLUGIN_PROXY >> scripts/env.list
    fi

    BRIDGE_PLUGINS="distributed-tracing-plugin=${INTERNAL_HOST}:${PLUGIN_PORT}"
    echo BRIDGE_PLUGINS=$BRIDGE_PLUGINS >> scripts/env.list
}

function checkEndpoints(){
    previous_endpoint="$(grep 'BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=' scripts/env.list | cut -d= -f2-)"
    current_endpoint="$(oc whoami --show-server)"

    if [[ "$previous_endpoint" != "$current_endpoint" ]]; then
        RED='\033[0;31m'
        NO_COLOR='\033[0m' 
        echo -e "${RED}
        WARNING: Your previous and current cluster-endpoints don't match.
        You may need to update your env.list. 
        previous endpoint = ${previous_endpoint} 
        current endpoint = ${current_endpoint} 
        ${NO_COLOR}"
        
        read -n 1 -p "Would you like to update your env.list (Y/n)?" answer
        case ${answer:0:1} in
            y|Y )
                echo  -e "${RED}\nYes, recreate env.list. \n${NO_COLOR}"
                createEnvironment
            ;;
            * )
                echo  -e "${RED}\nNo, keep previous env.list. \n${NO_COLOR}"
                echo "Using existing environment file: ./scripts/env.list"
            ;;
        esac
    fi
}

if [[ $CREATE_ENV == 1 ]] || [[ ! -f "scripts/env.list" ]]; then
    createEnvironment
else
  checkEndpoints
fi

echo "Console Image: $CONSOLE_IMAGE"
echo "Starting local OpenShift console"

# Prefer podman if installed. Otherwise, fall back to docker.
if [[ -x "$(command -v podman)" && $PREFER_PODMAN == 1 ]]; then
    if [ "$(uname -s)" = "Linux" ]; then
        echo "Using podman with host network..."
        # Use host networking on Linux since host.containers.internal is unreachable in some environments.
        podman run --pull always --rm --network=host  --env-file ./scripts/env.list $CONSOLE_IMAGE
    else
        echo "Using podman..."
        podman run --pull always --rm -p "$CONSOLE_PORT":9000 --env-file ./scripts/env.list $CONSOLE_IMAGE
    fi
else
    echo "Using docker..."
    docker run --pull always --rm -p "$CONSOLE_PORT":9000 --env-file ./scripts/env.list $CONSOLE_IMAGE
fi

echo "Console URL: http://localhost:${CONSOLE_PORT}"