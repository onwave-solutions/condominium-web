import React, { ComponentType, FunctionComponent } from "react";

const rtl = document.getElementsByTagName("html")[0].getAttribute("dir");

function withDirection<T>(
  Component: ComponentType<T>
): FunctionComponent<Partial<T>> {
  return (props: any) => <Component {...props} data-rtl={rtl} />;
}

export default withDirection;
export { rtl };
