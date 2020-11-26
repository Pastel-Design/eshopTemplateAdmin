// noinspection JSXNamespaceValidation

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
            vystaveni: "",
            plneni: "",
            splatnost: "",
            userInfo: []
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

    getUserInfo(email) {
        fetch("objednavky/faktury/data/userInfo/" + email)
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
        if (type === "user") {
            this.getUserInfo(value)
        }
    }

    addProduct(product) {

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
                    <DateSelect type={"vystaveni"} onValueChange={this.handleChange}/>
                    <DateSelect type={"plneni"} onValueChange={this.handleChange}/>
                    <DateSelect type={"splatnost"} onValueChange={this.handleChange}/>
                    <ProductSelect selectedProduct={this.addProduct}/>
                    <InvoicePage
                        name={this.state.invoiceType}
                        number={this.state.formData.number}
                        eshopInfo={this.state.formData.eshopInfo}
                        userInfo={this.state.userInfo}
                        vystaveni={this.state.vystaveni}
                        plneni={this.state.plneni}
                        splatnost={this.state.splatnost}
                    />
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
        const {name, number, eshopInfo, userInfo, vystaveni, plneni, splatnost} = this.props;

        return (
            <div id={"invoice-container"}>
                <div className={"invoice-header"}>
                    <img src={"www/images/pastel-logo.svg"} alt={"shop-logo"} height={50}/> <h3>{name} {number}</h3>
                </div>
                <div className={"address-row"}>
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
                <div className={"tax-info"}>
                    Datum vystavení: {standardDateFormat(vystaveni)}
                    Datum zdan. plnění: {standardDateFormat(plneni)}
                    Datum splatnosti: {standardDateFormat(splatnost)}
                </div>
            </div>
        )
    }
}

class InvoiceGeneratorSelect extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: "-"
        }
    }

    handleChange(e) {
        this.props.onValueChange(e.target.value, this.props.type);
        this.setState({value: e.target.value});
    }

    render() {
        const {type, items, name} = this.props;
        return (
            <div className={"input-group container-fluid"}>
                <label htmlFor={type + "-select"}>{name}</label>
                <select id={type + "-select"} name={type} className="form-control" value={this.state.value} onChange={this.handleChange}>
                    <option key={0} value={"-"}>
                        -
                    </option>
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

class DateSelect extends React.Component {

    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            date: getFormatedDate(date)
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({date: e.target.value});
        this.props.onValueChange(e.target.value, this.props.type);
    }

    componentDidMount() {
        this.props.onValueChange(this.state.date, this.props.type);
    }

    render() {
        const {type, name} = this.props;
        return (
            <div className={"input-group container-fluid"}>
                <label htmlFor={type + "-select"}>{name}</label>
                <input className="form-control" type="date" value={this.state.date} id={type + "-select"} onChange={this.handleChange}/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('invoice-app')
);

let getFormatedDate = function (date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = (0 + month.toString())
    }
    if (day < 10) {
        day = (0 + day.toString())
    }
    return (year.toString() + "-" + month.toString() + "-" + day.toString())
}
let standardDateFormat = function (date) {
    let dates = date.split("-");
    return dates[2] + "." + dates[1] + "." + dates[0];
}

class ProductSelect extends React.Component {
    constructor(props) {
        super(props);
        this.searchProduct = this.searchProduct.bind(this);
        this.state = {
            results: [],
            value: ""
        }
    }

    async searchProduct(e) {
        this.setState({value:e.target.value})
        if(e.target.value !==""){
            const response = await fetch("objednavky/faktury/hledatProdukty/" + e.target.value);
            const results = await response.json();
            let newResults =[];
            results.forEach(item=>{
                newResults.push(Object.values(item))
            })
            this.setState({results: newResults});
        }else{
            this.setState({results: []});
        }
    }

    selectProduct(product) {
        this.props.selectedProduct(product);
    }

    render() {
        return (
            <div className={"ProductSelect"}>
                <label htmlFor={"product-select"}>Přidat produkty</label>
                <input className="form-control" type="text" value={this.state.value} id={"product-select"} onChange={this.searchProduct}/>
                <SearchResults results={this.state.results} selectedOne={this.selectProduct}/>
            </div>
        )
    }
}

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"ProductSelect"}>
                {this.props.results}
            </div>
        )
    }
}
