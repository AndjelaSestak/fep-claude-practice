import httpx

FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2"


class ExchangeRateService:
    async def fetch_exchange_rate(self, from_currency: str, to_currency: str) -> float:
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()

        if from_currency == to_currency:
            return 1.0

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{FRANKFURTER_BASE_URL}/rate/{from_currency}/{to_currency}",
            )

        response.raise_for_status()
        data = response.json()

        return float(data["rate"])

    async def get_supported_currencies(self) -> list[dict[str, str]]:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{FRANKFURTER_BASE_URL}/currencies")

        response.raise_for_status()
        data = response.json()

        return [
            {
                "value": currency["iso_code"],
                "label": f"{currency['iso_code']} - {currency['name']}",
            }
            for currency in sorted(data, key=lambda item: item["iso_code"])
        ]

    async def convert_amount(
        self,
        amount: float,
        from_currency: str,
        to_currency: str,
    ) -> float:
        rate = await self.fetch_exchange_rate(from_currency, to_currency)
        return round(amount * rate, 2)


def fetch_exchange_rate(from_currency: str, to_currency: str) -> float:
    from_currency = from_currency.upper()
    to_currency = to_currency.upper()

    if from_currency == to_currency:
        return 1.0

    response = httpx.get(
        f"{FRANKFURTER_BASE_URL}/rate/{from_currency}/{to_currency}",
        timeout=10,
    )

    response.raise_for_status()
    data = response.json()

    return float(data["rate"])


def get_supported_currencies() -> list[dict[str, str]]:
    response = httpx.get(
        f"{FRANKFURTER_BASE_URL}/currencies",
        timeout=10,
    )

    response.raise_for_status()
    data = response.json()

    return [
        {
            "value": currency["iso_code"],
            "label": f"{currency['iso_code']} - {currency['name']}",
        }
        for currency in sorted(data, key=lambda item: item["iso_code"])
    ]


def convert_amount(amount: float, from_currency: str, to_currency: str) -> float:
    rate = fetch_exchange_rate(from_currency, to_currency)
    return round(amount * rate, 2)
