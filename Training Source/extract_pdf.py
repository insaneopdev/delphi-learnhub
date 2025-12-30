import PyPDF2
import json
import sys

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    text_content = []
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                if text.strip():
                    text_content.append({
                        'page': page_num + 1,
                        'text': text.strip()
                    })
        
        return {
            'success': True,
            'total_pages': num_pages,
            'content': text_content
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf.py <pdf_file>")
        sys.exit(1)
    
    pdf_file = sys.argv[1]
    output_file = pdf_file.replace('.pdf', '_extracted.txt')
    
    result = extract_pdf_text(pdf_file)
    
    # Write to file with UTF-8 encoding
    with open(output_file, 'w', encoding='utf-8') as f:
        if result['success']:
            f.write(f"Total Pages: {result['total_pages']}\n")
            f.write("="*80 + "\n\n")
            for page in result['content']:
                f.write(f"\n--- PAGE {page['page']} ---\n")
                f.write(page['text'])
                f.write("\n" + "="*80 + "\n")
        else:
            f.write(f"Error: {result['error']}\n")
    
    print(f"Extracted to: {output_file}")

