class CommandLine extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      commandList: []
    }
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

    let commandField = $('#command-line', evt.target);

    let command = new Command( commandField.val(), this.state.cwd );

    if ( ! this.intercept(command) ) {
      let _commandList = this.state.commandList;
      _commandList.push(command);

      this.setState({
        commandList: _commandList
      });
    }

    commandField.val('');
  }

  render () {
    return (
      <div>
        <p>{this.state.cwd}</p>
        <form onSubmit={this.submitHandler.bind(this)}>
          <input id='command-line' type='text' />
        </form>

        <div id='output'>
        {
          this.state.commandList.map( (command, i) => {
            return ( <CommandNode key={i} command={command} /> )
          })
        }
        </div>
      </div>
    );
  }
}
