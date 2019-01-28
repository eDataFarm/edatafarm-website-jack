class Contact extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <ContactContainer />
                {/* You can replace captchaDemo with any ref word */}
            </div>
        );
    }
}

ReactDOM.render(<Contact />, document.getElementById('contact'));
