package com.example.gymapi.service;

import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Paiement;
import com.example.gymapi.repository.MembreRepository;
import com.example.gymapi.repository.PaiementRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final MembreRepository membreRepository;
    private final PaiementRepository paiementRepository;

    public byte[] exportMembresExcel() throws IOException {
        List<Membre> membres = membreRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Membres");

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font font = workbook.createFont();
            font.setBold(true);
            font.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(font);

            Row header = sheet.createRow(0);
            String[] cols = {"ID", "Nom", "Prénom", "Email",
                             "Téléphone", "Date inscription", "Statut"};
            for (int i = 0; i < cols.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5500);
            }

            int rowNum = 1;
            for (Membre m : membres) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(m.getId());
                row.createCell(1).setCellValue(m.getNom());
                row.createCell(2).setCellValue(m.getPrenom());
                row.createCell(3).setCellValue(m.getEmail());
                row.createCell(4).setCellValue(
                    m.getTelephone() != null ? m.getTelephone() : "");
                row.createCell(5).setCellValue(
                    m.getDateInscription() != null
                        ? m.getDateInscription().toString() : "");
                row.createCell(6).setCellValue(m.getStatut().name());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportPaiementsExcel() throws IOException {
        List<Paiement> paiements = paiementRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Paiements");

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font font = workbook.createFont();
            font.setBold(true);
            font.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(font);

            Row header = sheet.createRow(0);
            String[] cols = {"ID", "Membre", "Montant (MAD)",
                             "Date échéance", "Date paiement", "Méthode", "Statut"};
            for (int i = 0; i < cols.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5500);
            }

            int rowNum = 1;
            for (Paiement p : paiements) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(
                    p.getMembre().getPrenom() + " " + p.getMembre().getNom());
                row.createCell(2).setCellValue(p.getMontant().doubleValue());
                row.createCell(3).setCellValue(p.getDateEcheance().toString());
                row.createCell(4).setCellValue(
                    p.getDatePaiement() != null
                        ? p.getDatePaiement().toString() : "—");
                row.createCell(5).setCellValue(
                    p.getMethodePaiement() != null
                        ? p.getMethodePaiement() : "—");
                row.createCell(6).setCellValue(p.getStatut().name());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportMembresPdf() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("GymManager — Liste des Membres")
                .setFontSize(20).setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(8));

        document.add(new Paragraph("Généré le : " + LocalDate.now())
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        Table table = new Table(UnitValue.createPercentArray(
            new float[]{1, 2, 2, 3, 2, 2}));
        table.setWidth(UnitValue.createPercentValue(100));

        String[] headers = {"ID", "Nom", "Prénom", "Email", "Inscription", "Statut"};
        for (String h : headers) {
            com.itextpdf.layout.element.Cell headerCell =
                new com.itextpdf.layout.element.Cell()
                    .add(new Paragraph(h).setBold())
                    .setBackgroundColor(ColorConstants.DARK_GRAY)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(6);
            table.addHeaderCell(headerCell);
        }

        List<Membre> membres = membreRepository.findAll();
        boolean alt = false;
        for (Membre m : membres) {
            Color bg = alt ? ColorConstants.LIGHT_GRAY : ColorConstants.WHITE;
            alt = !alt;
            table.addCell(pdfCell(String.valueOf(m.getId()), bg));
            table.addCell(pdfCell(m.getNom(), bg));
            table.addCell(pdfCell(m.getPrenom(), bg));
            table.addCell(pdfCell(m.getEmail(), bg));
            table.addCell(pdfCell(
                m.getDateInscription() != null
                    ? m.getDateInscription().toString() : "—", bg));
            table.addCell(pdfCell(m.getStatut().name(), bg));
        }

        document.add(table);
        document.add(new Paragraph("Total : " + membres.size() + " membres")
                .setFontSize(10).setMarginTop(12).setBold());
        document.close();
        return out.toByteArray();
    }

    private com.itextpdf.layout.element.Cell pdfCell(String text, Color bg) {
        return new com.itextpdf.layout.element.Cell()
                .add(new Paragraph(text != null ? text : "").setFontSize(9))
                .setBackgroundColor(bg)
                .setPadding(4);
    }
}