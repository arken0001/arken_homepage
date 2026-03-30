#!/usr/bin/env python3
"""SEO 주간 보고서 이메일 발송 스크립트 - 2026-03-30"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

report_path = Path(__file__).parent / "seo_report_2026-03-30.html"
html_body = report_path.read_text(encoding="utf-8")

subject = "[SEO 주간 보고서] arken·komoshnik·kosnova - 2026-03-30"

msg = MIMEMultipart('alternative')
msg['Subject'] = subject
msg['From'] = 'bhwoo@arken.co.kr'
msg['To'] = 'bhwoo@arken.co.kr'
msg.attach(MIMEText(html_body, 'html', 'utf-8'))

with smtplib.SMTP('smtp.gmail.com', 587) as s:
    s.starttls()
    s.login('bhwoo@arken.co.kr', 'xdgy aohj hbdk hkhw')
    s.send_message(msg)
    print('이메일 발송 완료')
