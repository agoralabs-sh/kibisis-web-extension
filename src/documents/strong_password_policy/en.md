## Overview

Passwords are an integral aspect of Kibisis. Passwords are the front line of protection for encrypting user's private keys. As such, a poorly chosen password may result in the compromise of your private keys, Therefore, users  are responsible for taking the appropriate steps, as outlined below, to select strong passwords and to store their passwords securely.

## Purpose

The purpose of this policy is to establish a standard for creation of strong passwords, protection of those passwords, and the frequency of change.

## Scope

The scope of this policy includes all users who store private keys using Kibisis.

## Policy

### General Users

Passwords must not be included in email messages or other forms of electronic communication. Passwords must be at least 8 characters in length. It is highly recommended that passwords be changed, at least, every 90 days.

### Guidelines

User passwords must conform to these guidelines.

It is important that everyone be aware of how to select strong passwords. Below, is the a general guideline on strong password construction.

Poor, weak passwords have the following characteristics:

- The password can be found in a dictionary (English or foreign).
- The password is a common usage word such as: Names of family, pets, friends, co-workers, fantasy characters, computer terms and names, commands, sites, companies, hardware, software, birthdays and other personal information such as addresses and phone numbers.
- Word or number patterns like aaabbb, qwerty, zyxwvuts, 123321, l33t, etc. Any of the above spelled backwards. Any of the above preceded or followed by a digit (e.g., secret1, 1secret).

Strong passwords have the following characteristics:

- Contain both upper and lower case characters (e.g., a-z, A-Z)
- Have digits and punctuation characters as well as letters e.g., 0-9, !@#$%^&*()_+|~-=\`{}[]:";'<>?,./)
- Are at least eight alphanumeric characters long.
- Are not a word in any language, slang, dialect, jargon, etc.
- Are not based on personal information, names of family, etc.

Try to create passwords that can be easily remembered. One way to do this is create a password based on a song title, affirmation, or other phrase. For example, the phrase might be: "This May Be One Way To Remember" and the password could be: "TmB1w2R!" or "Tmb1W>r~" or some other variation.

> 🚨 WARNING: Do not use either of these examples as passwords!

### Password protection standards

- Change passwords at least once every 90 days.
- Do not write down passwords
- Do not store passwords on-line without encryption.
- Do not use the same password for other accounts (e.g., personal ISP account, on-line banking, email, etc.).
- Do not share your passwords with anyone. All passwords are to be treated as sensitive and confidential information, as if your life depended on it!
- NEVER reveal a password over the phone to ANYONE!
- NEVER reveal a password in an email message.
- Don't talk about a password in front of others.
- Don't hint at the format of a password (e.g., "my family name")
- Don't share a password with family members.

If someone demands a password, refer them to this document or call the police, they maybe trying to rob you.

> ⚠️ NOTE: If an account or password is suspected to have been compromised, CHANGE IT IMMEDIATELY, your private keys may not be safe.

### Password Scoring

Password cracking or guessing may be performed by an attacker. To negate this, when creating a new password, the complexity of the password is scored by:

- 0 - Easily guessable. Absolutely insecure password. Can be guessed in less than 10^3 attempts.
- 1 - Very guessable. Protection from throttled online attacks. Can be guessed in less than 10^6 attempts.
- 2 - Somewhat guessable. Protection from unthrottled online attacks. Can be guessed in less than 10^8 attempts.
- 3 - Safely unguessable. Moderate protection from offline slow-hash scenario. Can be guessed in less than 10^10 attempts.
- 4 - Very unguessable. Strong protection from offline slow-hash scenario. It would require more than 10^10 attempts.


Password creation enforces at least a score of 3.
