This project is still under development. The following features are partially implemented or pending:

User Statistics in Redux

updateStats reducer exists but the User type does not yet include stats. Needs schema update.




UI for displaying penalties is not fully implemented.

Profile Picture Upload

File upload and preview implemented locally, but image persistence (backend or storage service) is not connected.

Currently resets on page reload.

Rental History

Placeholder logic exists, but actual integration with a backend API or persistent store is not completed.

Authentication Enhancements

Currently uses DummyJSON API
 for login simulation.

No refresh token / JWT validation.

Logout only clears localStorage without API call.

Error Handling

Limited error handling for failed API calls.

No retry or fallback mechanism in place.



Navigation bar is responsive, but some profile and rental pages require additional mobile-friendly styling.