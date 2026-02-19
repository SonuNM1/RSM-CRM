## 8th Feb, 2025 

- Super admin account created with script 
- Super Admin login 
- User invite with role (admin, BDE, Executive)
- User accepts invite, registers with password and name 
- User login 
- Forgot password 
- Refresh token in user and admin login 
- Logout 

## 9th Feb, 2025 

- OTP rate limit 
- Gmail -> SendGrid -> AWS SES 
- SMTP Provider (Gmail SMTP, SendGrid, AWS SES)

- implemented SendGrid (product of Twilio)
- Request OTP 
- Validate OTP 
- Reset password 
- Email templates 
- get-me backend 

- Protected routes (according to the role)
- Cookies (token not lost on refresh, persistence)


## 10th Feb, 2025 

- protect routes 
- auth persistence on reload (check logged in user)
- ProtectedRoute 
- lottie loader spinner 
- Remember Me (User logs in, Session persists across browser restarts, User stays logged in for 30 days) - it doesnt mean store password, it means longer session duration 

- Resend OTP 
- Role-based guard (Admin, Employee)


## 15th Feb, 2025 

- Deduplication: saves db calls 
- website normalization (example.com, www.example.com, https://www.example.com)
- Submit leads 
- website normalization and duplicate detection (email or website)
- unique leads are submited, duplicates skipped 
- insertedCount, skippedCount 
- result modal showing total submitted, saved and duplicates with clear status messaging 
- improved UX by resetting form only when at least one lead is successfully inserted 

## 

- Sales follow up 
- Pipeline tracking 
- Reporting 