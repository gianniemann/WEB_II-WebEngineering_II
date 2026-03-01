"use strict";

let apiBase = "http://127.0.0.1:3000/api";

let currencies = [];
let rates = [];
let transactions = [];

let fallbackCurrencies = [
    { "id": 1, "iso_code": "CHF", "name": "Swiss Franc", "countries": "Switzerland, Liechtenstein" },
    { "id": 2, "iso_code": "EUR", "name": "Euro", "countries": "Austria, Belgium, France, Germany, Italy, Spain, Vatican City" },
    { "id": 3, "iso_code": "USD", "name": "United States Dollar", "countries": "United States" },
    { "id": 4, "iso_code": "GBP", "name": "Pound Sterling", "countries": "United Kingdom" }
];

let fallbackRates = [
    { "id": 1, "base_currency": "CHF", "target_currency": "EUR", "rate_value": 1.03, "rate_date": "2026-02-01 10:00:00" },
    { "id": 2, "base_currency": "CHF", "target_currency": "USD", "rate_value": 1.12, "rate_date": "2026-02-01 10:00:00" },
    { "id": 3, "base_currency": "EUR", "target_currency": "CHF", "rate_value": 0.97, "rate_date": "2026-02-01 10:00:00" }
];

async function init() {
    await loadCurrencies();
    await loadRates();
    await loadTransactions();

    renderCurrencies();
    renderRates();
    renderTransactions();
    renderCurrencySelects();

    document.getElementById("calculatorOutput").innerHTML = "<p>Noch keine Berechnung.</p>";
    document.getElementById("loginOutput").innerHTML = "<p>Noch kein Login.</p>";
    document.getElementById("transactionFormOutput").innerHTML = "<p>Noch keine neue Transaktion gespeichert.</p>";
}

async function loadCurrencies() {
    try {
        let response = await fetch(`${apiBase}/currencies`);
        if (!response.ok) {
            throw new Error("Could not load currencies.");
        }
        currencies = await response.json();
        document.getElementById("statusOutput").innerHTML = "<p>Backend verbunden: Currencies geladen.</p>";
    } catch (error) {
        currencies = fallbackCurrencies;
        document.getElementById("statusOutput").innerHTML = "<p>Backend nicht erreichbar. Fallback-Daten für Currencies aktiv.</p>";
    }
}

async function loadRates() {
    try {
        let response = await fetch(`${apiBase}/rates`);
        if (!response.ok) {
            throw new Error("Could not load rates.");
        }
        rates = await response.json();
    } catch (error) {
        rates = fallbackRates;
    }
}

async function loadTransactions() {
    try {
        let response = await fetch(`${apiBase}/transactions`);
        if (!response.ok) {
            throw new Error("Could not load transactions.");
        }
        transactions = await response.json();
    } catch (error) {
        transactions = [];
    }
}

function renderCurrencies() {
    let output = "";
    output += "<table border='1' cellpadding='4'>";
    output += "<tr><th>ID</th><th>ISO</th><th>Name</th><th>Countries</th></tr>";

    currencies.forEach(currency => {
        output += `<tr><td>${currency.id}</td><td>${currency.iso_code}</td><td>${currency.name}</td><td>${currency.countries}</td></tr>`;
    });

    output += "</table>";
    document.getElementById("currenciesOutput").innerHTML = output;
}

function renderRates() {
    let output = "";
    output += "<table border='1' cellpadding='4'>";
    output += "<tr><th>ID</th><th>From</th><th>To</th><th>Rate</th><th>Date</th></tr>";

    rates.forEach(rate => {
        output += `<tr><td>${rate.id}</td><td>${rate.base_currency}</td><td>${rate.target_currency}</td><td>${rate.rate_value}</td><td>${rate.rate_date}</td></tr>`;
    });

    output += "</table>";
    document.getElementById("ratesOutput").innerHTML = output;
}

function renderTransactions() {
    let output = "";
    output += "<table border='1' cellpadding='4'>";
    output += "<tr><th>ID</th><th>Date</th><th>User</th><th>Amount</th><th>From</th><th>To</th><th>Rate</th></tr>";

    transactions.forEach(transaction => {
        output += `<tr><td>${transaction.id}</td><td>${transaction.transaction_date}</td><td>${transaction.user_login}</td><td>${transaction.source_amount}</td><td>${transaction.source_currency}</td><td>${transaction.target_currency}</td><td>${transaction.exchange_rate}</td></tr>`;
    });

    output += "</table>";
    document.getElementById("transactionsOutput").innerHTML = output;
}

function renderCurrencySelects() {
    let options = "";
    currencies.forEach(currency => {
        options += `<option value='${currency.iso_code}'>${currency.iso_code}</option>`;
    });

    document.getElementById("sourceCurrency").innerHTML = options;
    document.getElementById("targetCurrency").innerHTML = options;
    document.getElementById("transactionSourceCurrency").innerHTML = options;
    document.getElementById("transactionTargetCurrency").innerHTML = options;

    document.getElementById("sourceCurrency").value = "CHF";
    document.getElementById("targetCurrency").value = "EUR";
    document.getElementById("transactionSourceCurrency").value = "CHF";
    document.getElementById("transactionTargetCurrency").value = "EUR";
}

function calculateAmount() {
    let sourceAmount = Number(document.getElementById("sourceAmount").value);
    let sourceCurrency = document.getElementById("sourceCurrency").value;
    let targetCurrency = document.getElementById("targetCurrency").value;

    let foundRate = rates.find(rate => rate.base_currency === sourceCurrency && rate.target_currency === targetCurrency);

    if (!foundRate) {
        document.getElementById("calculatorOutput").innerHTML = "<p>Kein passender Kurs gefunden.</p>";
        return;
    }

    let targetAmount = sourceAmount * Number(foundRate.rate_value);
    document.getElementById("calculatorOutput").innerHTML = `<p>${sourceAmount} ${sourceCurrency} = ${targetAmount.toFixed(2)} ${targetCurrency}</p>`;
}

async function doLogin() {
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    try {
        let response = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: login, password: password })
        });

        if (!response.ok) {
            throw new Error("Invalid login");
        }

        let user = await response.json();
        document.getElementById("loginOutput").innerHTML = `<p>Login ok: ${user.first_name} ${user.last_name} (${user.login})</p>`;
    } catch (error) {
        document.getElementById("loginOutput").innerHTML = "<p>Login fehlgeschlagen oder Backend nicht erreichbar.</p>";
    }
}

async function createTransaction() {
    let now = new Date();
    let transactionData = {
        transaction_date: now.toISOString().slice(0, 19).replace("T", " "),
        user_login: document.getElementById("transactionUser").value,
        source_amount: Number(document.getElementById("transactionAmount").value),
        source_currency: document.getElementById("transactionSourceCurrency").value,
        target_currency: document.getElementById("transactionTargetCurrency").value,
        exchange_rate: Number(document.getElementById("transactionRate").value)
    };

    try {
        let response = await fetch(`${apiBase}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            throw new Error("Could not save transaction.");
        }

        document.getElementById("transactionFormOutput").innerHTML = "<p>Transaktion gespeichert.</p>";
        await loadTransactions();
        renderTransactions();
    } catch (error) {
        document.getElementById("transactionFormOutput").innerHTML = "<p>Speichern fehlgeschlagen oder Backend nicht erreichbar.</p>";
    }
}
