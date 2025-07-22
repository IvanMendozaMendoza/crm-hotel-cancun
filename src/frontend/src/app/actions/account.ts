"use server";

export async function updateAccount(formData: FormData) {
  // TODO: Integrate with backend API
  // Example: await fetch('/api/account', { method: 'POST', body: formData })
  console.log("Account update submitted:", Object.fromEntries(formData.entries()));
} 