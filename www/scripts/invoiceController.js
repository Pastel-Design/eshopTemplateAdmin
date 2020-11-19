// noinspection JSXNamespaceValidation
class Invoice extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <h3>{this.props.name}</h3>
        )
    }

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
            user: "",
            userInfo:[]
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
    getUserInfo(email){
        fetch("objednavky/faktury/data/userInfo/"+email)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        userInfo: result
                    });
                },
                (error) => {
                    this.setState({
                        error: error
                    });
                }
            )
    }
    handleChange(value, type) {
        this.setState({[type]: value});
        if(type === "user"){
            this.getUserInfo(value)
        }
    }

    render() {
        let invoiceType = [{"name": "Faktura", "id": 1}, {"name": "Dobropis", "id": 2}]

        if (this.state.isLoaded) {
            return (
                <div className={"container-fluid"}>
                    <h1>Nová faktura</h1>
                    <InvoiceGeneratorSelect name={"Typ faktury"} type={"invoiceType"} items={invoiceType} value={this.state["invoiceType"]} onValueChange={this.handleChange}/>
                    <InvoiceGeneratorSelect name={"Platba"} type={"payment"} items={this.state.formData.payments} value={this.state["payment"]} onValueChange={this.handleChange}/>
                    <InvoiceGeneratorSelect name={"Doprava"} type={"shipping"} items={this.state.formData.shipping} value={this.state["shipping"]} onValueChange={this.handleChange}/>
                    <InvoiceGeneratorSelect name={"Zákazník"} type={"user"} items={this.state.formData.users} value={this.state["user"]} onValueChange={this.handleChange}/>
                    <InvoicePage name={this.state.invoiceType} number={this.state.formData.number} eshopInfo={this.state.formData.eshopInfo} userInfo={this.state.userInfo}/>
                </div>
            )
        } else {
            return (
                    <div>Loading...</div>
            )
        }
    }
}

class InvoicePage extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        const {name,number,eshopInfo,userInfo} = this.props;
            return (
                <div id={"invoice-container"}>
                    <div className={"invoice-header"}>
                        <img src={"www/images/pastel-logo.svg"} alt={"shop-logo"} height={50}/> <h3>{name} {number}</h3>
                    </div>
                    <div className={"address-row"}>
                        {console.log(eshopInfo)}
                        {console.log(userInfo)}
                        <div className={"eshop-info-container"}>
                            <h4>Dodavatel:</h4>
                            <p>{eshopInfo.firm_name}</p>
                            <p>{eshopInfo.adress1}</p>
                            <p>{eshopInfo.adress2}</p>
                            <p>{eshopInfo.city} {eshopInfo.zipcode}</p>
                            <p>{eshopInfo.country}</p>
                            <p>{eshopInfo.DIC}</p>
                            <p>{eshopInfo.IC}</p>
                        </div>
                        <div className={"eshop-info-container"}>
                            <h4>Odběratel:</h4>
                            <p>{userInfo.firm_name}</p>
                            <p>{userInfo.first_name} {userInfo.last_name}</p>
                            <p>{userInfo.email} </p><p>{userInfo.area_code}{userInfo.phone}</p>
                            <p>{userInfo.adress1}</p>
                            <p>{userInfo.adress2}</p>
                            <p>{userInfo.city} {userInfo.zipcode}</p>
                            <p>{userInfo.country}</p>
                            <p>{userInfo.DIC}</p>
                            <p>{userInfo.IC}</p>
                        </div>
                    </div>
                </div>
            )
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

    componentDidMount() {
        this.props.onValueChange(this.props.items[0]["name"], this.props.type);
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