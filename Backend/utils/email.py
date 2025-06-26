import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def send_mail(subject: str, body: str, recipient_email: str):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = f"Job Portal <{SENDER_EMAIL}>"
    msg['To'] = recipient_email

    html_content = f"""
    <html>
      <head>
        <style>
          .email-container {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background-color: #f7f9fc;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: #333;
          }}
          .email-header {{
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }}
          .email-body {{
            padding: 20px;
          }}
          .email-footer {{
            margin-top: 30px;
            font-size: 12px;
            color: #888;
            text-align: center;
          }}
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>{subject}</h1>
          </div>
          <div class="email-body">
            <p>{body}</p>
          </div>
          <div class="email-footer">
            <p>You're receiving this email from Job Portal.</p>
          </div>
        </div>
      </body>
    </html>
    """

    msg.set_content(body)
    msg.add_alternative(html_content, subtype='html')

    try:
        print(f"Sending email to {recipient_email}...") 
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
            smtp.send_message(msg)
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
