from fpdf import FPDF


class SampleLegacyPDF(FPDF):
    def header(self):
        self.set_fill_color(42, 33, 29)
        self.rect(0, 0, 210, 24, "F")
        self.set_xy(18, 8)
        self.set_text_color(247, 240, 228)
        self.set_font("Helvetica", "B", 13)
        self.cell(0, 7, "Lecture Notes Archive", ln=1)


pdf = SampleLegacyPDF()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()
pdf.set_text_color(42, 33, 29)
pdf.set_font("Helvetica", "B", 20)
pdf.ln(17)
pdf.cell(0, 11, "Sample Legacy Reference", ln=1)
pdf.set_draw_color(180, 79, 54)
pdf.set_line_width(0.7)
pdf.line(18, 59, 192, 59)
pdf.ln(10)
pdf.set_font("Helvetica", "", 11)
pdf.multi_cell(
    0,
    7,
    "This lightweight sample PDF verifies the Legacy collection flow. Replace it with an actual PDF, PPT, PPTX, or other archived resource inside the matching subject folder. The website will discover supported files and expose a direct raw GitHub link.",
)
pdf.ln(8)
pdf.set_text_color(71, 98, 89)
pdf.set_font("Helvetica", "B", 10)
pdf.cell(0, 7, "Collection: Legacy / EEOE4001 Energy Conservation & Auditing")
pdf.output("/home/ubuntu/lecture-notes/digital notes/legacy/eeoe4001-energy-conservation-auditing/sample-legacy-reference.pdf")
