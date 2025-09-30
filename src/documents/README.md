# Documents Directory

This directory is for storing documents like:

- **Resume/CV**: Add your resume as a PDF file
- **Portfolio PDFs**: Any additional portfolio documents
- **Certificates**: Professional certificates or achievements

## File Naming Recommendations

- Use descriptive, URL-friendly names
- Avoid spaces (use hyphens instead)
- Examples:
  - `john-doe-resume.pdf`
  - `frontend-developer-portfolio.pdf`
  - `aws-certification.pdf`

## Update Configuration

After adding documents, update the file paths in `config/data.json`:

```json
{
  "personal": {
    "resumeUrl": "/public/documents/your-resume.pdf"
  }
}
```
