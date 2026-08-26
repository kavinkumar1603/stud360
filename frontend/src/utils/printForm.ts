export function printODForm(data: any) {
  const logoUrl = window.location.origin + '/clg_logo.webp';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>STUDENT ON DUTY REQUISITION FORM</title>
      <style>
        @page { size: A4; margin: 0; }
        body { 
          font-family: 'Times New Roman', Times, serif; 
          font-size: 14px; 
          margin: 0; 
          padding: 10mm; 
          box-sizing: border-box; 
          background: white; 
          color: black;
        }
        
        /* Header */
        .header-container { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding-bottom: 10px; 
          margin-bottom: 15px; 
        }
        .logo-placeholder { 
          flex: 1; 
          text-align: left; 
        }
        .logo-placeholder img { 
          height: 85px; 
          width: auto;
          max-width: 100%; 
          object-fit: contain; 
          object-position: left center;
        }
        .form-no-box { 
          border: 2px solid #000; 
          padding: 10px 15px; 
          text-align: center; 
          font-weight: bold; 
          font-size: 13px; 
          line-height: 1.3;
          flex-shrink: 0;
          margin-left: 15px;
        }
        
        /* Title Box */
        .title-box { 
          border: 2px solid #b91c1c; 
          border-radius: 12px; 
          text-align: center; 
          padding: 10px; 
          margin: 0 auto 15px auto; 
          width: 70%; 
          color: #000;
        }
        .title-box h2 { 
          margin: 0 0 5px 0; 
          font-size: 17px; 
          font-weight: bold; 
        }
        .title-box strong {
          font-size: 15px;
        }
        
        /* Intimation */
        .intimation { 
          text-align: right; 
          margin-bottom: 5px; 
          font-weight: bold; 
          font-size: 14px; 
        }
        
        /* Tables */
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 10px; 
        }
        td, th { 
          border: 1.5px solid #000; 
          padding: 8px 10px; 
          text-align: left; 
          font-size: 14px;
        }
        .col-label { 
          width: 42%; 
          font-weight: bold; 
        }
        
        /* Office Use */
        .office-use { 
          text-align: center; 
          font-weight: bold; 
          margin: 15px 0 10px 0; 
          font-size: 14px;
        }
        
        /* Footer Box */
        .footer-note { 
          font-size: 12px; 
          font-style: italic; 
          text-align: center; 
          font-weight: bold; 
          margin-bottom: 3px; 
        }
        .bottom-container {
          border: 1.5px solid #000;
          position: relative;
          padding: 10px;
          min-height: 150px;
        }
        
        .placement-box { 
          position: absolute;
          top: 0;
          right: 0;
          width: 250px; 
          border-left: 1.5px solid #000;
          border-bottom: 1.5px solid #000;
          text-align: center; 
        }
        .placement-title {
          font-size: 11px; 
          font-weight: bold; 
          text-decoration: underline;
          padding: 5px;
          border-bottom: 1.5px solid #000;
        }
        .placement-sig {
          height: 35px;
        }
        
        .vision-mission { 
          font-size: 10px; 
          line-height: 1.3; 
          margin-top: 30px;
          width: 70%;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header-container">
        <div class="logo-placeholder">
          <img src="${logoUrl}" alt="Sri Eshwar College Logo" />
        </div>
        <div class="form-no-box">
          CENTRE FOR INNOVATION<br/>(CFI)<br/>Form No.: CFI/OD/IS/01
        </div>
      </div>

      <!-- Title Box -->
      <div class="title-box">
        <h2>STUDENT ON DUTY REQUISITION FORM</h2>
        <strong>AcademicYear:${data.academicYear || '202_-202_'}</strong>
      </div>

      <!-- Intimation Date -->
      <div class="intimation">
        Date of Intimation: <u>&nbsp;&nbsp;&nbsp;${new Date().toLocaleDateString('en-GB')}&nbsp;&nbsp;&nbsp;</u>
      </div>

      <!-- Main Table -->
      <table>
        <tr>
          <td class="col-label">Name of the Student(s)</td>
          <td>${data.studentNames}</td>
        </tr>
        <tr>
          <td class="col-label">Department</td>
          <td>${data.department}</td>
        </tr>
        <tr>
          <td class="col-label">Register Number(s)</td>
          <td>${data.registerNumbers}</td>
        </tr>
        <tr>
          <td class="col-label">Year/Semester/Section</td>
          <td>${data.year || ''} / ${data.semester || ''} / ${data.section || ''}</td>
        </tr>
        <tr>
          <td class="col-label">Number of Days & Date</td>
          <td><u>${data.numberOfDays}</u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; From: <u>${data.fromDate}</u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; to: <u>${data.toDate}</u></td>
        </tr>
        <tr>
          <td class="col-label">Name& Designation of the Mentor</td>
          <td>${data.mentorName} - ${data.mentorDesignation}</td>
        </tr>
        <tr>
          <td class="col-label">Reason for OD (Event Name and Venue)</td>
          <td>${data.eventName} - ${data.venue}</td>
        </tr>
        <tr>
          <td class="col-label">Contact Number of the Student</td>
          <td>${data.contactNumber}</td>
        </tr>
        <tr>
          <td class="col-label">Signature of the Student(s)</td>
          <td style="height: 40px;"></td>
        </tr>
      </table>

      <!-- Office Use -->
      <div class="office-use">**********************************ForOfficeUseOnly**********************************</div>

      <!-- Office Table -->
      <table>
        <tr>
          <td class="col-label">No. of ONDUTY</td>
          <td style="font-weight: bold; width: 19%;">Eligible:</td>
          <td style="font-weight: bold; width: 19%;">Availed:</td>
          <td style="font-weight: bold; width: 20%;">Balance:</td>
        </tr>
        <tr>
          <td class="col-label">Signature of the Mentor & Class Advisor</td>
          <td colspan="3" style="height: 35px;"></td>
        </tr>
        <tr>
          <td class="col-label">Signature of the Dept. Innovation Head</td>
          <td colspan="3" style="height: 35px;"></td>
        </tr>
        <tr>
          <td class="col-label">Signature of the HOD</td>
          <td colspan="3" style="height: 35px;"></td>
        </tr>
        <tr>
          <td class="col-label" style="border-right: none;">Office CFI</td>
          <td style="border-left: none; border-right: none;"></td>
          <td colspan="2" style="border-left: none; font-weight: bold; text-align: center;">Signature of the Head Innovations</td>
        </tr>
      </table>

      <!-- Footer Section -->
      <div class="footer-note">*In case Corporate Hackathon need to get signature from placement cell*</div>
      
      <div class="bottom-container">
        <div class="placement-box">
          <div class="placement-title">PLACEMENT ASSOCIATE DIRECTOR</div>
          <div class="placement-sig"></div>
        </div>

        <div class="vision-mission">
          <strong>VISION of the Institution:</strong><br/>
          To be recognized as a premier institution, grooming students into globally acknowledged engineering professionals.<br/>
          We will achieve the <strong>MISSION</strong> of the Institution by:<br/>
          M1: Providing out come and value based engineering education<br/>
          M2: Nurturing research and entrepreneurial culture<br/>
          M3: Enabling students to be industry ready and fulfill their career aspirations<br/>
          M4: Grooming students through behavioral and leadership training programs<br/>
          M5: Making students socially responsible
        </div>
      </div>

    </body>
    </html>
  `;

  // Create an off-screen iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    
    // Wait for image/DOM to load before printing
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      // Cleanup after print dialog opens
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 500);
  }
}
