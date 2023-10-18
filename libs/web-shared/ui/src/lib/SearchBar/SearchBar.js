import './SearchBar.css';
import { Form } from 'react-bootstrap';
import { SearchIcon } from '@athena/web-shared/ui';
import { useEffect } from 'react';

export function SearchBar(props) {
  useEffect(() => {
    console.log("propsdssssssss", props);
  }, [props])
  
  const handleEvent = (event) => {
    var keyCode = event.keyCode || event.which;
    if (keyCode == '13') {
      console.log('enter pressed');
      event.preventDefault();
      return false;
    }
  }
  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className='search-zindex'
      >
        <Form.Group
          className={
            'position-relative form-search' +
            (props.forrmgroupclassname ? ` ${props.forrmgroupclassname}` : '')
          }
          controlId="formBasicEmail"
        >
          <SearchIcon />
          <Form.Control
            className={
              'search-box' + (props.className ? ` ${props.className}` : '')
            }
            type="search"
            //placeholder="Search"
            placeholder={props.placeholder ? props.placeholder : `Search`}
            onChange={props.onChange}
            onKeyDown={handleEvent}
            // onKeyUp={props.onKeyUp}
            {...props}

          />
        </Form.Group>
      </Form>
    </div>
  );
}
export default SearchBar;
