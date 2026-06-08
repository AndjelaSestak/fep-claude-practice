import csv
import io
import os
from datetime import date

from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")


class GenerateReportService:
    def __init__(self) -> None:
        self.env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

    def generate_csv_report(self, transactions) -> bytes:

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            ["Date", "Recipient", "Amount", "Currency", "Type", "Direction"]
        )

        for t in transactions:
            date_str = t.created_at.strftime("%d.%m.%Y") if t.created_at else "N/A"

            writer.writerow(
                [
                    date_str,
                    t.recipient,
                    t.amount,
                    t.currency,
                    t.type.value,
                    t.direction.value,
                ]
            )

        return output.getvalue().encode("utf-8-sig")

    def generate_pdf_report(self, transactions, user_email: str) -> bytes:
        if not transactions:
            html_content = (
                "<html><body><h1>No transactions available</h1></body></html>"
            )
            return HTML(string=html_content).write_pdf()

        total_in = sum(
            float(t.amount) for t in transactions if t.direction.value == "incoming"
        )
        total_out = sum(
            float(t.amount) for t in transactions if t.direction.value == "outgoing"
        )
        neto = total_in - total_out

        template = self.env.get_template("report/generate_report_pdf.html")

        html_content = template.render(
            transactions=transactions,
            user_email=user_email,
            date_today=date.today().strftime("%d.%m.%Y"),
            total_in=f"{total_in:.2f}",
            total_out=f"{total_out:.2f}",
            neto=f"{neto:.2f}",
        )

        return HTML(string=html_content).write_pdf()
