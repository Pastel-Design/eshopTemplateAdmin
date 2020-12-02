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
            products: {},
            vystaveni: "",
            plneni: "",
            splatnost: "",
            userInfo: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.addUser = this.addUser.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.productChange = this.productChange.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
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
    }

    addUser(user) {
        this.setState({user: user});
        this.getUserInfo(user)
    }

    async addProduct(product) {
        const response = await fetch("objednavky/faktury/produkt/" + product);
        let productInfo = await response.json()
        let stateProducts = this.state.products;
        if (product in stateProducts) {
            stateProducts[product].count++;
        } else {
            productInfo[0].count = 1;
            stateProducts[product] = productInfo[0]
        }
        this.setState({products: stateProducts});
    }

    productChange(type, value, product) {
        let isNumber = function (str) {
            let pattern = /^\d+$/;
            return pattern.test(str);
        }
        let isPriceNumber = function (str) {
            let pattern = /^\d+(\.|,)?\d{0,2}$/;
            return pattern.test(str);
        }
        if (type === "price") {
            if (isPriceNumber(value)) {
                value = value.replace(",", ".");
                let stateProducts = this.state.products;
                stateProducts[product][type] = value;
                this.setState({products: stateProducts});
            }
            if (value === "") {
                let stateProducts = this.state.products;
                stateProducts[product][type] = value;
                this.setState({products: stateProducts});
            }
        } else {
            if (isNumber(value)) {
                let stateProducts = this.state.products;
                stateProducts[product][type] = value;
                this.setState({products: stateProducts});
            }
            if (value === "") {
                let stateProducts = this.state.products;
                stateProducts[product][type] = value;
                this.setState({products: stateProducts});
            }
        }
    }

    removeProduct(product) {
        let products = this.state.products;
        delete products[product];
        this.setState({products: products})
    }

    render() {
        let invoiceType = [{"name": "Faktura", "id": 1}, {"name": "Dobropis", "id": 2}]

        if (this.state.isLoaded) {
            return (
                <div className={"invoice-generator-container"}>
                    <div>
                        <h1>Nová faktura</h1>
                        <div className={"select-group"}>
                            <InvoiceDataSelect name={"Typ faktury"} type={"invoiceType"} items={invoiceType} value={this.state["invoiceType"]} onValueChange={this.handleChange}/>
                            <InvoiceDataSelect name={"Platba"} type={"payment"} items={this.state.formData.payments} value={this.state["payment"]} onValueChange={this.handleChange}/>
                            <InvoiceDataSelect name={"Doprava"} type={"shipping"} items={this.state.formData.shipping} value={this.state["shipping"]} onValueChange={this.handleChange}/>
                        </div>
                        <div className={"select-group"}>
                            <DateSelect name={"Datum vystavení"} type={"vystaveni"} onValueChange={this.handleChange}/>
                            <DateSelect name={"Datum zdanitelné plnění"} type={"plneni"} onValueChange={this.handleChange}/>
                            <DateSelect name={"Datum splatnost"} type={"splatnost"} onValueChange={this.handleChange}/>
                        </div>
                        <UserSelect name={"Vybrat uživatele"} selectedUser={this.addUser}/>
                        <ProductSelect name={"Přidat produkty"} selectedProduct={this.addProduct}/>
                        <ProductsTable products={this.state.products} updateProduct={this.productChange} removeProduct={this.removeProduct}/>
                    </div>
                    <div>
                        <InvoicePage
                            name={this.state.invoiceType}
                            platba={this.state.payment}
                            doprava={this.state.shipping}
                            number={this.state.formData.number}
                            eshopInfo={this.state.formData.eshopInfo}
                            userInfo={this.state.userInfo}
                            vystaveni={this.state.vystaveni}
                            plneni={this.state.plneni}
                            splatnost={this.state.splatnost}
                            products={this.state.products}
                        />
                    </div>
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
                <div className={"tax-row"}>
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
                        <p>Datum vystavení: {standardDateFormat(vystaveni)}</p>
                        <p>Datum zdan. plnění: {standardDateFormat(plneni)}</p>
                        <p>Datum splatnosti: {standardDateFormat(splatnost)}</p>
                    </div>
                </div>
                <ProductsInvoiceTable products={this.props.products} platba={this.props.platba} doprava={this.props.doprava}/>
            </div>
        )
    }
}

class InvoiceDataSelect extends React.Component {

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
            <div>
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
            <div>
                <label htmlFor={type + "-select"}>{name}</label>
                <input className="form-control" type="date" value={this.state.date} id={type + "-select"} onChange={this.handleChange}/>
            </div>
        );
    }
}

class UserSelect extends React.Component {
    constructor(props) {
        super(props);
        this.searchUser = this.searchUser.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.state = {
            results: [],
            value: ""
        }
    }

    async searchUser(e) {
        this.setState({value: e.target.value})
        if (e.target.value !== "") {
            const response = await fetch("objednavky/faktury/hledatUzivatele/" + e.target.value);
            const results = await response.json();
            this.setState({results: results});
        } else {
            this.setState({results: []});
        }
    }

    selectUser(user) {
        this.props.selectedUser(user);
        this.setState({value: ""})
        this.setState({results: []});
    }

    render() {
        const {name} = this.props;
        return (
            <div>
                <label htmlFor={"user-select"}>{name}</label>
                <input className="form-control" type="text" value={this.state.value} id={"user-select"} onChange={this.searchUser}/>
                <SearchResults results={this.state.results} selectedOne={this.selectUser}/>
            </div>
        )
    }
}

class ProductSelect extends React.Component {
    constructor(props) {
        super(props);
        this.searchProduct = this.searchProduct.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        this.state = {
            results: [],
            value: ""
        }
    }

    async searchProduct(e) {
        this.setState({value: e.target.value})
        if (e.target.value !== "") {
            const response = await fetch("objednavky/faktury/hledatProdukty/" + e.target.value);
            const results = await response.json();
            this.setState({results: results});
        } else {
            this.setState({results: []});
        }
    }

    selectProduct(product) {
        this.props.selectedProduct(product);
        this.setState({value: ""})
        this.setState({results: []});
    }

    render() {
        const {name} = this.props;
        return (
            <div>
                <label htmlFor={"product-select"}>{name}</label>
                <input className="form-control" type="text" value={this.state.value} id={"product-select"} onChange={this.searchProduct}/>
                <SearchResults results={this.state.results} selectedOne={this.selectProduct}/>
            </div>
        )
    }
}

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.selectItem = this.selectItem.bind(this);
    }

    selectItem(e) {
        this.props.selectedOne(e.target.getAttribute("value"));
    }

    render() {
        const items = this.props.results;
        if (Object.keys(items).length === 0) {
            return (
                <div></div>
            )
        } else {
            return (
                <div className={"search-results"}>
                    {items.map(item => (
                        <div key={item.id}>
                            <img src={"images/" + item.image} height={"40px"}/>
                            {item.name}
                            <button className={"btn btn-info"} value={item.dashName} onClick={this.selectItem}>Přidat</button>
                        </div>
                    ))}
                </div>
            )
        }

    }
}

class ProductsTable extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
    }

    updateProduct(type, value, product) {
        this.props.updateProduct(type, value, product);
    }

    onChange(e) {
        let type = e.target.getAttribute("itemType");
        let value = e.target.value;
        let product = e.target.getAttribute("productname");
        this.updateProduct(type, value, product)
    }

    removeProduct(e) {
        this.props.removeProduct(e.target.getAttribute("productname"))
    }

    render() {
        const items = Object.values(this.props.products);
        if (Object.keys(items).length === 0 && items.constructor === Array) {
            return false;
        } else {
            return (
                <React.Fragment>
                    <table className={"table table-striped"}>
                        <thead>
                        <tr>
                            <th colSpan={2}>Název</th>
                            <th>Počet</th>
                            <th>Jednotková cena</th>
                            <th>Celková cena</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <button className={"btn btn-danger"} onClick={this.removeProduct} productname={item.dashName}>Odebrat</button>
                                </td>
                                <td>
                                    {item.name}
                                </td>
                                <td>
                                    <input type={"text"} className={"form-control"} value={item.count} itemType={"count"} productname={item.dashName} onChange={this.onChange}/>
                                </td>
                                <td>
                                    <input type={"text"} className={"form-control"} value={item.price} itemType={"price"} productname={item.dashName} onChange={this.onChange}/>
                                </td>
                                <td>
                                    {item.price * item.count}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </React.Fragment>
            )

        }
    }
}

class ProductsInvoiceTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let propProducts = Object.values(this.props.products);
        console.log(this.props.doprava);
        console.log(this.props.platba);
        propProducts.doprava = {"name": this.props.doprava, "count": 1, "price": 0};
        propProducts.platba = {"name": this.props.platba, "count": 1, "price": 0};
        console.log(propProducts)
        const products = propProducts;
        if (Object.keys(products).length === 0) {
            return false;
        } else {
            return (
                <div className={"produts"}>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Produkt</th>
                            <th>Počet ks</th>
                            <th>Cena za kus</th>
                            <th>Cena celkem</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(item => (
                            <tr key={item.id}>
                                <td>
                                    {item.name}
                                </td>
                                <td>
                                    {item.count} ks
                                </td>
                                <td>
                                    {item.price*1} Kč
                                </td>
                                <td>
                                    {item.price * item.count} Kč
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )
        }
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

