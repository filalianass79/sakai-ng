import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
    providedIn: 'root',
})
export class ExportFileService {
    constructor() {}

    getHeader(selectedColumns: any) {
        const selectedHeaders: string[] = [];
        const cols: number = selectedColumns.length;
        for (let i = 0; i < cols; i++) {
            selectedHeaders.push(selectedColumns[i].header);
        }
        return selectedHeaders;
    }

    getValues(dataTable: Table, selectedColumns: any) {
        const cols: number = selectedColumns.length;
        let dataPdf = dataTable.value;
        let rows: number = dataPdf.length;
        if (dataTable.filteredValue != null) {
            rows = dataTable.filteredValue.length;
            dataPdf = dataTable.filteredValue;
        }
        return dataPdf;
    }

    exportToPdf(dataTable: Table, selectedColumns: any) {
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Titre du document
        doc.setFontSize(16);
        doc.text('Liste des Utilisateurs', 14, 15);
        doc.setFontSize(10);
        
        // Préparer les données
        const headers = this.getHeader(selectedColumns);
        const data = this.getValues(dataTable, selectedColumns);
        const rows = data.map(row => 
            selectedColumns.map((col: { field: string }) => row[col.field])
        );

        // Configuration du tableau
        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 20,
            theme: 'grid',
            headStyles: {
                fillColor: [79, 129, 189],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 20 }, // ID
                1: { cellWidth: 40 }, // Username
                2: { cellWidth: 60 }, // Email
                3: { cellWidth: 30 }, // FirstName
                4: { cellWidth: 30 }  // LastName
            },
            margin: { top: 20, left: 10, right: 10 },
            didDrawPage: function(data: any) {
                // Ajouter le numéro de page
                doc.setFontSize(8);
                doc.text(
                    'Page ' + doc.internal.pages.length,
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
            }
        });

        // Sauvegarder le PDF
        doc.save('utilisateurs_' + new Date().getTime() + '.pdf');
    }

    exportToExcel(dataTable: Table, selectedColumns: any) {
        // Créer un nouveau classeur
        const wb = XLSX.utils.book_new();
        
        // Préparer les données pour l'export
        const data = this.getValues(dataTable, selectedColumns);
        const headers = this.getHeader(selectedColumns);
        
        // Créer un tableau avec les en-têtes et les données
        const wsData = [
            headers,
            ...data.map(row => selectedColumns.map((col: { field: string }) => row[col.field]))
        ];
        
        // Créer la feuille de calcul
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
        
        // Définir les styles pour les en-têtes
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" }
        };
        
        // Appliquer les styles aux en-têtes
        for (let i = 0; i < headers.length; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
            if (!ws[cellRef]) continue;
            if (!ws[cellRef].s) ws[cellRef].s = {};
            ws[cellRef].s = headerStyle;
        }
        
        // Ajuster la largeur des colonnes
        const colWidths = selectedColumns.map((col: { header: string }) => ({
            wch: Math.max(col.header.length, 15) // Minimum 15 caractères de large
        }));
        ws['!cols'] = colWidths;
        
        // Ajouter des bordures à toutes les cellules
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellRef]) continue;
                if (!ws[cellRef].s) ws[cellRef].s = {};
                ws[cellRef].s.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }
        
        // Ajouter la feuille au classeur
        XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');
        
        // Générer le fichier Excel
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Sauvegarder le fichier
        saveAs(dataBlob, 'utilisateurs_' + new Date().getTime() + '.xlsx');
    }
}
