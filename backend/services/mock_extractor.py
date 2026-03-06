from models.schemas import (
    ExtractedDocument, DocumentType, LineItem,
)


class MockExtractor:
    """Returns pre-built extraction results for demo purposes."""

    def extract_lr(self) -> ExtractedDocument:
        return ExtractedDocument(
            doc_type=DocumentType.LORRY_RECEIPT,
            file_name="sample_lr.pdf",
            document_number="LR-2024-00847",
            date="2024-11-15",
            vendor_name="FastTrack Logistics Pvt Ltd",
            vendor_gstin="27AABCF1234M1Z5",
            customer_name="RapidCargo Industries",
            customer_gstin="27AADCR5678N1Z8",
            origin="Mumbai, Maharashtra",
            destination="Pune, Maharashtra",
            vehicle_number="MH-04-AB-1234",
            total_weight=4850.0,
            weight_unit="kg",
            number_of_packages=120,
            total_amount=45000.00,
            items=[
                LineItem(
                    description="Industrial Bearings SKF-6205",
                    quantity=50,
                    unit="boxes",
                    unit_price=450.0,
                    amount=22500.0,
                    hsn_code="8482",
                ),
                LineItem(
                    description="Hydraulic Seals HS-108",
                    quantity=40,
                    unit="boxes",
                    unit_price=350.0,
                    amount=14000.0,
                    hsn_code="4016",
                ),
                LineItem(
                    description="Steel Flanges SF-200",
                    quantity=30,
                    unit="pieces",
                    unit_price=283.33,
                    amount=8500.0,
                    hsn_code="7307",
                ),
            ],
            confidence_score=0.94,
            raw_text="LORRY RECEIPT\nFastTrack Logistics Pvt Ltd\nLR No: LR-2024-00847\nDate: 15-Nov-2024\nFrom: Mumbai, Maharashtra\nTo: Pune, Maharashtra\nVehicle: MH-04-AB-1234\nGSTIN: 27AABCF1234M1Z5\n\nItems:\nIndustrial Bearings SKF-6205 | 50 boxes | Rs 22,500\nHydraulic Seals HS-108 | 40 boxes | Rs 14,000\nSteel Flanges SF-200 | 30 pieces | Rs 8,500\n\nTotal Weight: 4,850 kg | Packages: 120\nTotal Value: Rs 45,000",
        )

    def extract_pod(self) -> ExtractedDocument:
        return ExtractedDocument(
            doc_type=DocumentType.PROOF_OF_DELIVERY,
            file_name="sample_pod.pdf",
            document_number="POD-2024-00847",
            date="2024-11-17",
            vendor_name="FastTrack Logistics Pvt Ltd",
            vendor_gstin="27AABCF1234M1Z5",
            customer_name="RapidCargo Industries",
            customer_gstin="27AADCR5678N1Z8",
            origin="Mumbai, Maharashtra",
            destination="Pune, Maharashtra",
            vehicle_number="MH-04-AB-1234",
            total_weight=4780.0,
            weight_unit="kg",
            number_of_packages=118,
            total_amount=43800.00,
            items=[
                LineItem(
                    description="Industrial Bearings SKF-6205",
                    quantity=50,
                    unit="boxes",
                    unit_price=450.0,
                    amount=22500.0,
                    hsn_code="8482",
                ),
                LineItem(
                    description="Hydraulic Seals HS-108",
                    quantity=38,
                    unit="boxes",
                    unit_price=350.0,
                    amount=13300.0,
                    hsn_code="4016",
                ),
                LineItem(
                    description="Steel Flanges SF-200",
                    quantity=30,
                    unit="pieces",
                    unit_price=266.67,
                    amount=8000.0,
                    hsn_code="7307",
                ),
            ],
            confidence_score=0.91,
            raw_text="PROOF OF DELIVERY\nFastTrack Logistics Pvt Ltd\nPOD No: POD-2024-00847\nDate: 17-Nov-2024\nFrom: Mumbai | To: Pune\nVehicle: MH-04-AB-1234\n\nReceived Items:\nIndustrial Bearings SKF-6205 | 50 boxes | Rs 22,500\nHydraulic Seals HS-108 | 38 boxes | Rs 13,300\nSteel Flanges SF-200 | 30 pieces | Rs 8,000\n\nTotal Weight: 4,780 kg | Packages: 118\nTotal Value: Rs 43,800\n\nReceiver Signature: [Signed]\nDate Received: 17-Nov-2024",
        )

    def extract_invoice(self) -> ExtractedDocument:
        return ExtractedDocument(
            doc_type=DocumentType.INVOICE,
            file_name="sample_invoice.pdf",
            document_number="INV-2024-05521",
            date="2024-11-18",
            vendor_name="FastTrack Logistics Pvt Ltd",
            vendor_gstin="27AABCF1234M1Z5",
            customer_name="RapidCargo Industries",
            customer_gstin="27AADCR5678N1Z8",
            origin="Mumbai, Maharashtra",
            destination="Pune, Maharashtra",
            vehicle_number="MH-04-AB-1234",
            total_weight=4850.0,
            weight_unit="kg",
            number_of_packages=120,
            subtotal=44300.00,
            tax_amount=7974.00,
            total_amount=52274.00,
            items=[
                LineItem(
                    description="Industrial Bearings SKF-6205",
                    quantity=50,
                    unit="boxes",
                    unit_price=450.0,
                    amount=22500.0,
                    hsn_code="8482",
                ),
                LineItem(
                    description="Hydraulic Seals HS-108",
                    quantity=40,
                    unit="boxes",
                    unit_price=350.0,
                    amount=14000.0,
                    hsn_code="4016",
                ),
                LineItem(
                    description="Steel Flanges SF-200",
                    quantity=30,
                    unit="pieces",
                    unit_price=260.0,
                    amount=7800.0,
                    hsn_code="7307",
                ),
            ],
            confidence_score=0.97,
            raw_text="TAX INVOICE\nFastTrack Logistics Pvt Ltd\nGSTIN: 27AABCF1234M1Z5\nInvoice No: INV-2024-05521\nDate: 18-Nov-2024\n\nBill To: RapidCargo Industries\nGSTIN: 27AADCR5678N1Z8\n\nItems:\nIndustrial Bearings SKF-6205 | 50 boxes | @450 | Rs 22,500\nHydraulic Seals HS-108 | 40 boxes | @350 | Rs 14,000\nSteel Flanges SF-200 | 30 pieces | @260 | Rs 7,800\n\nSubtotal: Rs 44,300\nCGST (9%): Rs 3,987\nSGST (9%): Rs 3,987\nTotal: Rs 52,274\n\nWeight: 4,850 kg | Packages: 120",
        )
