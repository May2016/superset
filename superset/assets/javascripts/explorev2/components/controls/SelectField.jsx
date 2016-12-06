import React, { PropTypes } from 'react';
import { slugify } from '../../../modules/utils';
import Select, { Creatable } from 'react-select';


const propTypes = {
  name: PropTypes.string.isRequired,
  choices: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  multi: PropTypes.bool,
  freeForm: PropTypes.bool,
  clearable: PropTypes.bool,
};

const defaultProps = {
  multi: false,
  freeForm: false,
  value: '',
  label: null,
  description: null,
  onChange: () => {},
  clearable: true,
};

export default class SelectField extends React.Component {
  onChange(opt) {
    let optionValue = opt ? opt.value : null;
    // if multi, return options values as an array
    if (this.props.multi) {
      optionValue = opt ? opt.map((o) => o.value) : null;
    }
    if (this.props.name === 'datasource' && optionValue !== null) {
      this.props.onChange(this.props.name, optionValue, opt.label);
    } else {
      this.props.onChange(this.props.name, optionValue);
    }
  }
  renderOption(opt) {
    if (this.props.name === 'viz_type') {
      const url = `/static/assets/images/viz_thumbnails/${opt.value}.png`;
      return (
        <div>
          <img className="viz-thumb-option" src={url} alt={opt.value} />
          <span>{opt.value}</span>
        </div>
      );
    }
    return opt.label;
  }
  render() {
    const choices = this.props.choices.map || [];
    console.log(this.props.name);
    console.log(choices);
    const options = choices.map((c) => ({ value: c[0], label: c[1] }));
    if (this.props.freeForm) {
      // For FreeFormSelect, insert value into options if not exist
      const values = choices.map((c) => c[0]);
      if (values.indexOf(this.props.value) === -1) {
        options.push({ value: this.props.value, label: this.props.value });
      }
    }

    const selectProps = {
      multi: this.props.multi,
      name: `select-${this.props.name}`,
      placeholder: `Select (${choices.length})`,
      options,
      value: this.props.value,
      autosize: false,
      clearable: this.props.clearable,
      onChange: this.onChange.bind(this),
      optionRenderer: this.renderOption.bind(this),
    };
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectWrap = this.props.freeForm ?
      (<Creatable {...selectProps} />) : (<Select {...selectProps} />);

    return (
      <div id={`formControlsSelect-${slugify(this.props.label)}`}>
        {selectWrap}
      </div>
    );
  }
}

SelectField.propTypes = propTypes;
SelectField.defaultProps = defaultProps;