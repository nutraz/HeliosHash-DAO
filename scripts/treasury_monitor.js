#!/usr/bin/env node

/**
 * Treasury Monitor Script
 * Monitors treasury canister transactions and alerts on suspicious activity
 * Part of the treasury hardening plan
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const ALERT_THRESHOLD = 1000000; // 1M OWP tokens
const MONITOR_INTERVAL = 30000; // 30 seconds
const LOG_FILE = path.join(__dirname, '..', 'logs', 'treasury-monitor.log');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Logger
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    console.log(logMessage.trim());
    fs.appendFileSync(LOG_FILE, logMessage);
}

// Alert function
function alert(message, severity = 'WARNING') {
    log(`🚨 ALERT: ${message}`, severity);

    // In production, this could send emails, Slack notifications, etc.
    // For now, just log with high visibility
    console.log('\n' + '='.repeat(80));
    console.log(`🚨 ${severity} ALERT: ${message}`);
    console.log('='.repeat(80) + '\n');
}

// Check if dfx is available
function checkDfx() {
    try {
        execSync('dfx --version', { stdio: 'pipe' });
        return true;
    } catch (error) {
        log('dfx not found in PATH', 'ERROR');
        return false;
    }
}

// Get treasury canister ID
function getTreasuryCanisterId() {
    try {
        const output = execSync('dfx canister id treasury', { encoding: 'utf8' });
        return output.trim();
    } catch (error) {
        log('Failed to get treasury canister ID', 'ERROR');
        return null;
    }
}

// Get recent transactions
function getRecentTransactions(canisterId, limit = 10) {
    try {
        const command = `dfx canister call ${canisterId} listTx '(0, ${limit})'`;
        const output = execSync(command, { encoding: 'utf8' });

        // Parse the output (this is a simplified parser)
        // In production, you'd want more robust parsing
        return parseTransactions(output);
    } catch (error) {
        log(`Failed to get transactions: ${error.message}`, 'ERROR');
        return [];
    }
}

// Simple transaction parser (would need to be more robust)
function parseTransactions(output) {
    // This is a placeholder - real implementation would parse Motoko records
    // For now, return mock data for demonstration
    return [
        {
            id: 1,
            from: 'aaaaa-aa',
            to: 'bbbbb-bb',
            amount: 50000,
            timestamp: Date.now() - 10000
        },
        {
            id: 2,
            from: 'ccccc-cc',
            to: 'ddddd-dd',
            amount: 2500000, // Large transfer
            timestamp: Date.now() - 5000
        }
    ];
}

// Analyze transactions for suspicious activity
function analyzeTransactions(transactions) {
    const alerts = [];

    transactions.forEach(tx => {
        // Check for large transfers
        if (tx.amount >= ALERT_THRESHOLD) {
            alerts.push({
                type: 'LARGE_TRANSFER',
                severity: 'HIGH',
                message: `Large transfer detected: ${tx.amount} OWP from ${tx.from} to ${tx.to}`,
                transaction: tx
            });
        }

        // Check for unusual patterns (placeholder logic)
        // In production: velocity checks, known bad addresses, etc.
        if (tx.amount > ALERT_THRESHOLD * 2) {
            alerts.push({
                type: 'VERY_LARGE_TRANSFER',
                severity: 'CRITICAL',
                message: `Very large transfer: ${tx.amount} OWP - requires immediate review`,
                transaction: tx
            });
        }
    });

    return alerts;
}

// Get treasury security status
function getSecurityStatus(canisterId) {
    try {
        const command = `dfx canister call ${canisterId} getSecurityStatus '()'`;
        const output = execSync(command, { encoding: 'utf8' });

        // Parse security status
        return parseSecurityStatus(output);
    } catch (error) {
        log(`Failed to get security status: ${error.message}`, 'ERROR');
        return null;
    }
}

// Parse security status (simplified)
function parseSecurityStatus(output) {
    // Placeholder parsing
    return {
        daoConfigured: true,
        identityConfigured: true,
        multisigConfigured: true,
        governanceConfigured: true,
        isLocked: true,
        isPaused: false,
        totalSupply: 1000000000
    };
}

// Main monitoring function
async function monitorTreasury() {
    log('Starting treasury monitoring...');

    if (!checkDfx()) {
        log('Cannot proceed without dfx', 'ERROR');
        process.exit(1);
    }

    const canisterId = getTreasuryCanisterId();
    if (!canisterId) {
        log('Cannot proceed without treasury canister ID', 'ERROR');
        process.exit(1);
    }

    log(`Monitoring treasury canister: ${canisterId}`);

    // Main monitoring loop
    setInterval(() => {
        try {
            // Get recent transactions
            const transactions = getRecentTransactions(canisterId);
            log(`Checked ${transactions.length} recent transactions`);

            // Analyze for suspicious activity
            const alerts = analyzeTransactions(transactions);
            alerts.forEach(alert => {
                alert(alert.message, alert.severity);
            });

            // Check security status
            const securityStatus = getSecurityStatus(canisterId);
            if (securityStatus) {
                if (!securityStatus.isLocked) {
                    alert('Treasury configuration is not locked!', 'CRITICAL');
                }
                if (securityStatus.isPaused) {
                    alert('Treasury operations are paused', 'WARNING');
                }
                if (!securityStatus.daoConfigured) {
                    alert('DAO not configured in treasury', 'HIGH');
                }
                if (!securityStatus.governanceConfigured) {
                    alert('Governance not configured in treasury', 'HIGH');
                }
            }

        } catch (error) {
            log(`Monitoring error: ${error.message}`, 'ERROR');
        }
    }, MONITOR_INTERVAL);
}

// Graceful shutdown
process.on('SIGINT', () => {
    log('Treasury monitoring stopped');
    process.exit(0);
});

// Start monitoring
monitorTreasury().catch(error => {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
});
