import './ReactSelect.css';
import Select from 'react-select';

export const ReactSelect = (props) => {
  const { options, className, ...otherprops } = props;
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className={className? `${className}`:''} {...otherprops}>
       <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
    </div>
  );
}
export default ReactSelect;
