# Security Policy

## Supported versions

Security fixes are applied to the current `main` branch and the latest public
deployment.

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability.
Instead, use GitHub's private vulnerability reporting form:

https://github.com/PhilixTheExplorer/myantyper/security/advisories/new

Include a clear description, reproduction steps, affected commit or URL, and
the potential impact. Do not include sensitive user data in the report.

The current MyanTyper release is a static, local-first application with no
account system or backend. Reports involving browser storage, dependency
vulnerabilities, deployment configuration, or malicious lesson input are still
welcome.

You should receive an acknowledgement within seven days. Please allow time for
investigation and a coordinated fix before disclosing the issue publicly. If
private vulnerability reporting is unavailable, contact the maintainer through
the GitHub profile without publishing exploit details.

## Scope notes

- The application intentionally stores preferences and typing history in the
  browser. Anyone with access to the same browser profile can read or change it.
- The project does not claim to protect data on a compromised device or against
  malicious browser extensions.
- Reports should demonstrate a security impact rather than only a missing
  defense-in-depth header or an outdated dependency with no reachable path.
