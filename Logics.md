
## Authentication 

Admin-invited users > self-registration in CRM (otherwise any person with email can hit the register api, even if it goes for approval, there would be api hit) - this is how zoho crm , hubspot etc do it 

    no spam, full admin control, there shouldnt be public registration 

1. admin create user (email, role)
2. System sends invite link (single-use, time bound)
3. User sets password , then complete profile (like name)
4. User can login 
5. Roles/Executives - Admin, Sales Executive, Email executive 

## Bootstrap Super_Admin 

- Hardcoded admin will be bad, not sellable 
- Admin can self register (not enterprise): anyone would become admin, CRM dont do this 

- Employees and Admin will be invited by the Super_Admin 