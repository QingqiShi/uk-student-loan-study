import "react";

declare module "react" {
  interface ViewTransitionProps {
    name?: string;
    children: ReactNode;
    enter?: string;
    exit?: string;
  }

  const ViewTransition: React.FC<ViewTransitionProps>;
}
