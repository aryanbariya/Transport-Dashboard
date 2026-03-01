import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { format } from "date-fns";
import type { FirstReport } from "@/app/(main)/dashboard/firstreport/_components/schema";

export const generateTransportPDF = (tp: FirstReport) => {
    Swal.fire({
        title: "Download PDF",
        text: "Do you want to download the transport details as PDF?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, download it!",
        cancelButtonText: "No, cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const doc = new jsPDF();

                // Add title with larger font and centered
                doc.setFontSize(20);
                doc.setTextColor(0, 0, 0); // Black color
                doc.text("Transport Details", 105, 20, { align: 'center' });

                // Format dates
                const formatDate = (dateStr: string | null) => {
                    if (!dateStr) return "N/A";
                    try {
                        return format(new Date(dateStr), "dd/MM/yyyy");
                    } catch {
                        return dateStr;
                    }
                };

                // Add transport details with improved formatting
                doc.setFontSize(14);
                const details = [
                    ["TP No", tp.tpNo || "N/A"],
                    ["Base Depo", tp.baseDepoName || "N/A"],
                    ["Truck No", tp.truckName || "N/A"],
                    ["D.O Number", tp.do_id || tp.donumber || "N/A"],
                    ["Quota", tp.quota ? formatDate(tp.quota) : "N/A"],
                    ["Scheme", tp.schemeName || "N/A"],
                    ["Gross Weight", tp.grossWeight || "N/A"],
                    ["Net Weight", tp.netWeight || "N/A"],
                    ["Loaded Net Weight", tp.loadedNetWeight || "N/A"],
                    ["Godowns", tp.godown || "N/A"],
                    ["Vahtuks", tp.vahtuk || "N/A"],
                    ["Quantities", tp.quantity || "N/A"]
                ];

                autoTable(doc, {
                    startY: 30,
                    head: [['Field', 'Value']],
                    body: details,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [42, 48, 66],
                        textColor: [255, 255, 255],
                        fontSize: 14,
                        halign: 'center',
                        fontStyle: 'bold'
                    },
                    bodyStyles: {
                        fontSize: 12,
                        halign: 'center',
                        cellPadding: 6,
                        textColor: [0, 0, 0] // Black color
                    },
                    styles: {
                        cellPadding: 6,
                        fontSize: 12,
                        lineColor: [0, 0, 0], // Black borders
                        lineWidth: 0.5
                    },
                    columnStyles: {
                        0: { cellWidth: 60, fontStyle: 'bold' },
                        1: { cellWidth: 120 }
                    },
                    margin: { left: 15, right: 15 }
                });

                // Save the PDF
                doc.save(`Transport_${tp.tpNo || 'Details'}.pdf`);

                // Show success message
                Swal.fire({
                    icon: "success",
                    title: "PDF Downloaded",
                    text: "The transport details have been downloaded successfully!",
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error generating PDF:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to generate PDF. Please try again."
                });
            }
        }
    });
};
