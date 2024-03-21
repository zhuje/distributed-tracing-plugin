import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

interface Repository {
  name: string;
  branches: string | null;
  prs: string | null;
  workspaces: string;
  lastCommit: string;
}

type ExampleType = 'default' | 'compact' | 'compactBorderless';

export const TableBasic: React.FunctionComponent = () => {
  // In real usage, this data would come from some external source like an API via props.
  const repositories: Repository[] = [
    { name: 'one', branches: 'two', prs: 'three', workspaces: 'four', lastCommit: 'five' },
    { name: 'one - 2', branches: null, prs: null, workspaces: 'four - 2', lastCommit: 'five - 2' },
    { name: 'one - 3', branches: 'two - 3', prs: 'three - 3', workspaces: 'four - 3', lastCommit: 'five - 3' }
  ];

  const traces = [
    {
        startTimeUnixMs: 1710869970870.3076,
        durationMs: 972,
        spanCount: 2,
        errorCount: 0,
        traceId: "35fb2891f3a93b4bfa6943c53cff753e",
        name: "rootServiceName=\"load-generator\", rootTraceName=\"load-generator\"",
        startTime: "2024-03-19T17:39:30.870Z"
    },
    {
        startTimeUnixMs: 1710869967828.7974,
        durationMs: 678,
        spanCount: 2,
        errorCount: 0,
        traceId: "3aed156454945419ae4143d1260a381d",
        name: "rootServiceName=\"load-generator\", rootTraceName=\"load-generator\"",
        startTime: "2024-03-19T17:39:27.828Z"
    },
    {
        startTimeUnixMs: 1710869948136.808,
        durationMs: 857,
        spanCount: 2,
        errorCount: 0,
        traceId: "4438d9e104dd058917a608f3e10ee94b",
        name: "rootServiceName=\"load-generator\", rootTraceName=\"load-generator\"",
        startTime: "2024-03-19T17:39:08.136Z"
    }
  ]

  const columnNames = {
    traceId: 'Trace ID',
    durationMs: 'Duration (ms)',
    spanCount: 'Span count',
    errorCount: 'Error count',
    startTime: 'Start time'
  };

  // This state is just for the ToggleGroup in this example and isn't necessary for Table usage.
  const [exampleChoice, setExampleChoice] = React.useState<ExampleType>('default');

  return (
    <React.Fragment>
      <Table
        aria-label="Simple table"
        variant={exampleChoice !== 'default' ? 'compact' : undefined}
        borders={exampleChoice !== 'compactBorderless'}
      >
        <Thead>
          <Tr>
            <Th>{columnNames.traceId}</Th>
            <Th>{columnNames.durationMs}</Th>
            <Th>{columnNames.spanCount}</Th>
            <Th>{columnNames.errorCount}</Th>
            <Th>{columnNames.startTime}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {traces.map((trace) => (
            <Tr key={trace.traceId}>
              <Td dataLabel={columnNames.traceId}>{trace.traceId}</Td>
              <Td dataLabel={columnNames.durationMs}>{trace.durationMs}</Td>
              <Td dataLabel={columnNames.spanCount}>{trace.spanCount}</Td>
              <Td dataLabel={columnNames.errorCount}>{trace.errorCount}</Td>
              <Td dataLabel={columnNames.startTime}>{trace.startTime}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};
