import { Button } from '../Button/Button';
import { IconCircle, Message, Spinner, Title, Wrapper } from './StatusMessage.styles';

type StatusMessageProps =
  | { variant: 'loading'; title?: string }
  | { variant: 'error'; title?: string; message: string; onRetry?: () => void }
  | { variant: 'empty'; title: string; message?: string };

/** One component for the loading, error and empty states used across the app. */
export function StatusMessage(props: StatusMessageProps) {
  if (props.variant === 'loading') {
    return (
      <Wrapper role="status" aria-live="polite">
        <Spinner aria-hidden="true" />
        <Message>{props.title ?? 'Loading…'}</Message>
      </Wrapper>
    );
  }

  if (props.variant === 'error') {
    return (
      <Wrapper role="alert">
        <IconCircle $tone="error" aria-hidden="true">
          !
        </IconCircle>
        <Title>{props.title ?? 'Something went wrong'}</Title>
        <Message>{props.message}</Message>
        {props.onRetry && (
          <Button size="sm" onClick={props.onRetry}>
            Try again
          </Button>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <IconCircle $tone="neutral" aria-hidden="true">
        ∅
      </IconCircle>
      <Title>{props.title}</Title>
      {props.message && <Message>{props.message}</Message>}
    </Wrapper>
  );
}
