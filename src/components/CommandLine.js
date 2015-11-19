import React from 'react';

import Command from 'lib/classes/Command';
import CommandConstants from 'lib/constants/CommandConstants';
import CommandActions from 'lib/actions/CommandActions';

export default class CommandLine extends React.Component {

  constructor (props) {
    super(props);

    this.state = {}
  }

  componentDidMount () {
    this.setCwd('/home/scallywag');
  }

  intercept (cmd) {
    if (cmd.root === 'cd') {
      this.setCwd(cmd.args[0]);
      return true;
    }

    return false;
  }

  /*
   *  Sets the components state.cwd based on a relative or absolute
   *  input path.  If no path is passed in, the state will be set to
   *  a default value.
   */
  setCwd(dir) {
    let _cwd = '',
        path = require('path');

    // If we pass in an absolute path set cwd to it, otherwise
    // resolve the cwd based on the relative path.
    if (dir) {
       path.isAbsolute(dir) ?
        _cwd = dir :
        _cwd = path.join(this.state.cwd, dir);
    }

    this.setState({
      cwd: _cwd
    });
  }

  submitHandler(evt) {
    evt.preventDefault();

    let commandField = $('#command-line-input', evt.target);

    let command = new Command( commandField.val(), this.state.cwd );

    if ( ! this.intercept(command) ) {
      CommandActions.create(command);
    }

    commandField.val('');
  }

  clearCommands() {
    CommandActions.clear();
  }

  render () {
    return (
      <div id='command-line'>
        <p>{this.state.cwd}</p>
        <button onClick={this.clearCommands}>Clear</button>
        <form onSubmit={this.submitHandler.bind(this)}>
          <input id='command-line-input' type='text' />
        </form>
      </div>
    );
  }
}
