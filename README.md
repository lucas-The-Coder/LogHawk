# LogHawk 

Small Log Parser + Brute Force Detector in Node.js

LogHawk Mini reads a log file, parses each line, counts failures per IP, and flags brute force when failures reach threshold. Helpers return data, only main prints and saves. Built for learning backend log parsing basics: fs, reading files, regex, Map, Date, grouping.

## Features
- Parses log lines with regex, timestamp, status, IP
- Skips empty lines and bad lines, returns null for invalid lines
- Groups failures by IP using a Map
- Flags IP when failures reach threshold 5
- Handles missing file with try catch, no crash
- Saves findings to alerts.json

## How it works
- parseLogLine(line) returns an attempt object or null, with timestamp, status, ip
- countFailures(attempts) returns a Map, key is ip string, value is count number
- detectBruteForce(failures, threshold) returns a findings array, with ip and count
- main() reads the file, builds attempts, calls helpers, prints findings, saves alerts.json

## Usage

node log_hawk.js
node log_hawk.js sample_auth.log

## Examples

node log_hawk.js
BRUTE FORCE DETECTED: IP=203.0.113.10, Failures=6

node log_hawk.js missing.log
Error reading log file "missing.log": ENOENT: no such file or directory, open 'missing.log'

## Sample log

sample_auth.log holds 6 FAILED lines from 203.0.113.10, 1 SUCCESS from the same IP, 2 FAILED lines from 192.168.1.20, 1 SUCCESS from the same IP, plus 1 bad line with no IP. Only 203.0.113.10 flags, because it reaches threshold 5.

## Project structure

log_hawk.js, main CLI file
sample_auth.log, test log file
alerts.json, generated output, ignored by git
package.json, project metadata and scripts
.gitignore, ignored files
README.md, this file

## Security note
Log parsing is a core SOC skill. Always validate input, skip bad lines, and never trust a single indicator alone. In production, add time window grouping, success after brute force detection, and allow lists. This tool is for learning, it does not replace a full SIEM.

## Author
Luke Dennis, Midrand, South Africa
GitHub: https://github.com/lucas-The-Coder
LinkedIn: https://www.linkedin.com/in/luke-dennis-2730743b2
