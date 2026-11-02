import { Button } from '../Button/Button';
import styles from './StatusMessage.module.css';

type StatusMessageProps =
  | { variant: 'loading'; title?: string }
  | { variant: 'error'; title?: string; message: string; onRetry?: () => void }
  | { variant: 'empty'; title: string; message?: string };

/** One component for the loading, error and empty states used across the app. */
export function StatusMessage(props: StatusMessageProps) {
  const {
    wrapper,
    spinner,
    statusMessage,
    iconCircle,
    iconCircleError,
    statusTitle,
    iconCircleNeutral,
  } = styles;
  if (props.variant === 'loading') {
    return (
      <div className={wrapper} role="status" aria-live="polite">
        <span className={spinner} aria-hidden="true" />
        <p className={statusMessage}>{props.title ?? 'Loading…'}</p>
      </div>
    );
  }

  if (props.variant === 'error') {
    return (
      <div className={wrapper} role="alert">
        <span className={`${iconCircle} ${iconCircleError}`} aria-hidden="true">
          !
        </span>
        <h3 className={statusTitle}>{props.title ?? 'Something went wrong'}</h3>
        <p className={statusMessage}>{props.message}</p>
        {props.onRetry && (
          <Button size="sm" onClick={props.onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <span className={`${iconCircle} ${iconCircleNeutral}`} aria-hidden="true">
        ∅
      </span>
      <h3 className={statusTitle}>{props.title}</h3>
      {props.message && <p className={statusMessage}>{props.message}</p>}
    </div>
  );
}
