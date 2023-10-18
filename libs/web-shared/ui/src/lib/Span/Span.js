import './Span.css';
export function Span(props) {
  const { className, children, ...otherProps } = props;

  return (
    <span className={className ? ` ${className}` : ''} {...otherProps}>
    {props.children}
     </span>
  );
}
export default Span;
