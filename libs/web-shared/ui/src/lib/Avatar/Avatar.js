import './Avatar.css';
import Image from "react-bootstrap/Image";

export function Avatar(props) {
 const { size, roundedCircle, ...otherProps } = props;
 const addDefaultSrc = (event) => {
  //event.target.src = 'assets/images/course-placeholder.png'
}
  return (
    <Image
    {...otherProps}
    // roundedCircle={true}
    roundedCircle={roundedCircle ? true : false}
    onError={addDefaultSrc}
    style={{
      width: size,
      height: size,
    }}
    />
  );
}
export default Avatar;
