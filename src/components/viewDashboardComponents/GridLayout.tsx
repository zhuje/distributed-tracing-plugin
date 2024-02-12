// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { ErrorAlert, ErrorBoundary } from 'perses-dev/components';
import { usePanelGroup, PanelGroupId } from 'perses-dev/dashboards';
import { GridItemContent } from './GridItemContent';
import { Gallery } from '@patternfly/react-core';

export interface GridLayoutProps {
  panelGroupId: PanelGroupId;
}

/**
 * Layout component that arranges children in a Grid based on the definition.
 */
export function GridLayout(props: GridLayoutProps) {
  const { panelGroupId } = props;
  const groupDefinition = usePanelGroup(panelGroupId);

  return (
    <Gallery hasGutter minWidths={{ default: '360px' }}>
        {groupDefinition.itemLayouts.map(({ i }) => (
                <div key={i}>
                  <ErrorBoundary FallbackComponent={ErrorAlert}>
                      <GridItemContent panelGroupItemId={{ panelGroupId, panelGroupItemLayoutId: i }} />
                  </ErrorBoundary>
                </div>
            ))}
    </Gallery>
  );
}