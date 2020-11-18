// noinspection JSXNamespaceValidation
let renderPdf = function (params){

}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            formData: [],
            invoiceType: "",
            payment: "",
            shipping: "",
            user: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch("objednavky/faktury/data")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        formData: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }

    handleChange(value, type) {
        this.setState({[type]: value});
        renderPdf(this.state);
    }

    render() {
        let invoiceType = [{"name": "Objednávka", "id": 1}, {"name": "Dobropis", "id": 2}]

        if (this.state.isLoaded) {
            return (
                <div className={"container-fluid"}>
                    <h1>Nová faktura</h1>
                    <InvoiceGeneratorSelect name={"Typ faktury"} type={"invoiceType"} items={invoiceType} value={this.state["invoiceType"]} onValueChange={this.handleChange}/>
                    <InvoiceGeneratorSelect name={"Platba"} type={"payment"} items={this.state.formData.payments} value={this.state["payment"]} onValueChange={this.handleChange}/>
                    <InvoiceGeneratorSelect name={"Doprava"} type={"shipping"} items={this.state.formData.shipping} value={this.state["shipping"]} onValueChange={this.handleChange}/>
                    <InvoiceGeneratorSelect name={"Zákazník"} type={"user"} items={this.state.formData.users} value={this.state["user"]} onValueChange={this.handleChange}/>
                </div>
            )
        } else {
            return (
                <div>Loading...</div>
            )
        }
    }
}

class InvoiceGeneratorSelect extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onValueChange(e.target.value, this.props.type);
    }

    render() {
        const {type, items, value, name} = this.props;
        return (
            <div className={"input-group container-fluid"}>
                <label htmlFor={type + "-select"}>{name}</label>
                <select id={type + "-select"} name={type} className="form-control" value={value} onChange={this.handleChange}>
                    {items.map(item => (
                        <option key={item.id} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('invoice-app')
);

/*-------------------------------------------------------------------------------------------------------------------------------*/

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

function BoilingVerdict(props) {
    if (props.celsius >= 100) {
        return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
}

class TemperatureInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTemperatureChange(e.target.value);
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature}
                       onChange={this.handleChange}/>
            </fieldset>
        );
    }
}

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature: '', scale: 'c'};
    }

    handleCelsiusChange(temperature) {
        this.setState({scale: 'c', temperature});
    }

    handleFahrenheitChange(temperature) {
        this.setState({scale: 'f', temperature});
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

        return (
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange}/>
                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange}/>
                <BoilingVerdict
                    celsius={parseFloat(celsius)}/>
            </div>
        );
    }
}