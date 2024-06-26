import { Done, Error, Pending, Schedule } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { EntityType } from '../types';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import JSONTable from './JSONTable';

enum State {
  NOT_STARTED,
  STARTED,
  PERSISTED,
  DONE,
  ERROR_PERSIST,
  ERROR_QUERY,
}

export default function QueryTool({
  socket,
  entityType,
}: Readonly<{
  socket: Socket;
  entityType: EntityType | null;
}>) {
  const [state, setState] = useState<{ state: State; result?: string | Record<string, string>[] }>({
    state: State.NOT_STARTED,
  });

  const [query, setQuery] = useState<string>('{"id":{"$ne":"zzz"}}');

  const codeMirrorExtension = useMemo(() => json(), []);

  const run = useCallback(
    (entityType: EntityType, query: string) => {
      setState({ state: State.STARTED });

      socket.emit('run-query', { entityType, query });
      socket.on(
        'run-query-result',
        (result: { persisted?: boolean; queryError?: string; persistError?: string; queryResults?: string }) => {
          if (result.queryError || result.persistError || result.queryResults) {
            socket.off('run-query-result');
          }

          if (result.queryError) {
            setState({ state: State.ERROR_QUERY, result: result.queryError });
          } else if (result.persistError) {
            setState({ state: State.ERROR_PERSIST, result: result.persistError });
          } else if (result.queryResults) {
            setState({ state: State.DONE, result: result.queryResults });
          } else {
            setState({ state: State.PERSISTED });
          }
        },
      );
    },
    [state, socket],
  );

  if (entityType === null) {
    return <p>Select an entity type first</p>;
  }

  return (
    <>
      <Typography>Runs a query against the entity type.</Typography>

      <CodeMirror value={query} onChange={setQuery} extensions={[codeMirrorExtension]} />

      <Button variant="outlined" onClick={() => run(entityType, query)}>
        Run
      </Button>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5em', m: 2 }}>
        {state.state === State.NOT_STARTED ? (
          <Pending color="disabled" />
        ) : state.state === State.STARTED ? (
          <Schedule color="warning" />
        ) : state.state === State.ERROR_PERSIST ? (
          <Error color="error" />
        ) : (
          <Done color="success" />
        )}
        Persist to database
      </Typography>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5em', m: 2 }}>
        {state.state === State.NOT_STARTED || state.state === State.STARTED ? (
          <Pending color="disabled" />
        ) : state.state === State.PERSISTED ? (
          <Schedule color="warning" />
        ) : state.state === State.ERROR_PERSIST || state.state === State.ERROR_QUERY ? (
          <Error color="error" />
        ) : (
          <Done color="success" />
        )}{' '}
        Run query
      </Typography>
      {!!state.result &&
        (typeof state.result === 'string' ? <pre>{state.result}</pre> : <JSONTable data={state.result} />)}
    </>
  );
}
