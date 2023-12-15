import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import React, { useRef } from 'react';

export type Dimension2D<T = number> = { x: T; y: T };

export function Tooltip({ visible }: { visible: boolean }): JSX.Element {
  const {
    x,
    y,
    refs,
    strategy,
    context,
    // TODO use this?
    // elements
  } = useFloating({
    open: visible,
    placement: 'top',
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
    ],
  });

  // Event listeners to change the open state
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  return (
    <>
      {visible && (
        <div
          className="Tooltip"
          ref={refs.setFloating}
          style={{
            // Positioning styles
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            backgroundColor: 'red',
          }}
          {...getFloatingProps()}
        >
          I'm a tooltip!
        </div>
      )}
    </>
  );
}
interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelID, setLabelID] = React.useState<string | undefined>();
  const [descriptionID, setDescriptionID] = React.useState<
    string | undefined
  >();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,

    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'end',
      }),
      shift({ padding: 5 }),
    ],
  });

  const { context } = data;

  const click = useClick(context, {
    enabled: controlledOpen === null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelID,
      descriptionID,
      setLabelID,
      setDescriptionID,
    }),
    [open, setOpen, interactions, data, modal, labelID, descriptionID]
  );
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelID: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionID: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
    })
  | null;

const PopoverContext = React.createContext<ContextType>(null);

const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context === null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export function Popover({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> &
    PopoverTriggerProps & { termStatus: string; onClickWord: () => void }
>(
  (
    { children, onClickWord, termStatus, asChild = false, ...props },
    propRef
  ) => {
    const context = usePopoverContext();
    console.log(context.refs);
    const childrenRef = (children as any).ref;

    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
    const divRef = useRef<HTMLSpanElement | null>(null);
    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      );
    }
    const { ...refProps } = context.getReferenceProps(props);
    if (context.open) {
      console.log('TRIGGER', context.open, refProps);
    }

    return (
      <span
        // https://codesandbox.io/s/trusting-rui-2duieo?file=/src/ContextMenu.tsx
        className={`click word wsty${termStatus}`}
        ref={divRef}
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...refProps}
        onClick={(event) => {
          context.refs.setPositionReference(divRef.current!);
          onClickWord();
          event.stopPropagation();
        }}
      >
        {children}
      </span>
    );
  }
);

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>((props, propRef) => {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  console.log('POPOVER', context.open);
  return (
    <FloatingPortal>
      {context.open && (
        <FloatingFocusManager context={floatingContext} modal={context.modal}>
          <div
            ref={ref}
            id="TEST123-TOOLTIP"
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x ?? 0,
              width: 'max-content',
              ...props.style,
            }}
            aria-labelledby={context.labelID}
            aria-describedby={context.descriptionID}
            {...context.getFloatingProps(props)}
          >
            {props.children}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(({ children, ...props }, ref) => {
  const { setLabelID } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelID(id);
    return () => setLabelID(undefined);
  }, [id, setLabelID]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  );
});

export const PopoverBody = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
  const { setDescriptionID: setBodyID } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setBodyID(id);
    return () => setBodyID(undefined);
  }, [id, setBodyID]);

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  );
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  const { setOpen } = usePopoverContext();
  return (
    <button type="button" {...props} ref={ref} onClick={() => setOpen(false)}>
      {children}
    </button>
  );
});
