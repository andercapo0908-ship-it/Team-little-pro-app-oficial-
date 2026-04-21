# Security Specification - Team Little Pro

## 1. Data Invariants
- A `Workout` must belong to a valid `Student` and be created by a valid `Trainer`.
- A `Student` must be linked to a `Trainer`.
- `AppSettings` (config) are read-only for public/students and only editable by `Admin`.
- Users can only read/write their own `UserProfile`.
- Trainers can read profiles of all students.
- Admins have full access.

## 2. The Dirty Dozen (Attack Vectors)
1. **Identity Spoofing**: Student trying to write a workout for themselves.
2. **Privilege Escalation**: Student trying to set their own role to 'admin'.
3. **Data Harvesting**: Authenticated user trying to list all `users` in the system.
4. **Orphaned Writes**: Creating a workout for a student ID that doesn't exist.
5. **PII Leak**: Non-admin user reading another user's email.
6. **Shadow Update**: Adding an `isAdmin` field to a user profile update.
7. **Resource Poisoning**: Using a 1MB string for a `workout` name.
8. **Impersonation**: Setting `uid` field to another user's ID during creation.
9. **State Shortcut**: Marking an exercise as 'Completo' without being assigned to the workout.
10. **Unauthorized Config Change**: Student trying to change the app's `logoUrl`.
11. **Email Spoofing**: Admin accessing with a non-verified email (if enforcing verification).
12. **Denial of Wallet**: Infinite snapshot listeners on collections without filters.

## 3. Test Runner (Draft)
```typescript
// firestore.rules.test.ts (logic check)
// - expect(student.write(workout)).toSucceed()
// - expect(student2.read(workout)).toFail()
// - expect(public.read(config)).toSucceed()
```
