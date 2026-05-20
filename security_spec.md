# Security Specification

## Data Invariants
1. **Leads**: Any user can create a lead (contact request). No one can read leads except admins.
2. **Users**: Users can read their own profile. Admins can read all profiles. Only a system process or a bootstrap can set `isAdmin`.
3. **Artists/Venues/Events**: Publicly readable. Only admins can write (create/update/delete).

## The "Dirty Dozen" Payloads
1. **Lead Spoofing**: Attempt to create a lead with another user's ID. -> DENIED
2. **Admin Escalation**: Attempt to set `isAdmin: true` on own user profile update. -> DENIED
3. **Ghost Artist**: Create an artist with extra unvalidated fields like `verified: true`. -> DENIED
4. **Anonymous Lead Scraping**: Attempt to list all leads as a non-admin. -> DENIED
5. **PII Leak**: Attempt to read user email list as a regular user. -> DENIED
6. **Orphaned Event**: Create an event with a non-existent artist ID. -> DENIED
7. **Negative Stats**: Update venue stats to a negative number. -> DENIED
8. **Massive ID**: Use a 2KB string as a document ID to bloat DB. -> DENIED
9. **Identity Theft**: Update another user's profile. -> DENIED
10. **Shadow Field Injection**: Use `resource.data.keys().hasOnly()` bypass by adding extra fields in a permitted update. -> DENIED
11. **Future Timestamp Spoofing**: Set `createdAt` to a future date instead of `request.time`. -> DENIED
12. **Status Skipping**: Update a terminal state field (if status exists) directly. -> DENIED

## Test Plan
- Run `firestore-emulator` (if available) or rely on strict rule definitions and `DRAFT_firestore.rules` validation.
