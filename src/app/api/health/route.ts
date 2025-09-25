import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Check database connection if available
    let databaseStatus = 'unknown';
    try {
      // Add database health check here if you have a database connection
      databaseStatus = 'connected';
    } catch (error) {
      databaseStatus = 'disconnected';
      console.error('Database health check failed:', error);
    }

    // Check Internet Computer connection
    let icStatus = 'unknown';
    try {
      // Add IC health check here
      icStatus = 'connected';
    } catch (error) {
      icStatus = 'disconnected';
      console.error('IC health check failed:', error);
    }

    const response = {
      ...healthCheck,
      services: {
        database: databaseStatus,
        internet_computer: icStatus,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
