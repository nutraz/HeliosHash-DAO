import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIndiaCompliance } from '@/lib/compliance';
import { AlertTriangle, Calculator, CheckCircle, FileText, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ComplianceDashboardProps {
  monthlyRevenue?: number;
  foreignInvestments?: number;
  serviceRevenue?: number;
}

export function IndiaComplianceDashboard({
  monthlyRevenue = 8500000, // ₹85 lakh sample
  foreignInvestments = 6000000, // ₹60 lakh sample
  serviceRevenue = 2500000, // ₹25 lakh sample
}: ComplianceDashboardProps) {
  const { checkCompliance, validateTransaction, generateSummary } = useIndiaCompliance();
  const [complianceSummary, setComplianceSummary] = useState<any>(null);

  useEffect(() => {
    const summary = generateSummary(monthlyRevenue, foreignInvestments, serviceRevenue);
    setComplianceSummary(summary);
  }, [monthlyRevenue, foreignInvestments, serviceRevenue]);

  const sampleTransactions = [
    {
      type: 'crypto-to-inr',
      amount: 5500000,
      currency: 'USDC',
      description: 'Solar equipment payment from US investor',
    },
    {
      type: 'service-fee',
      amount: 150000,
      currency: 'INR',
      description: 'Grid management consulting',
    },
    {
      type: 'energy-trading',
      amount: 850000,
      currency: 'INR',
      description: 'Excess solar energy sale to state grid',
    },
  ];

  if (!complianceSummary) return <div>Loading compliance data...</div>;

  return (
    <div className='space-y-6 p-6 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-2'>
        <Globe className='h-8 w-8 text-orange-600' />
        <h1 className='text-3xl font-bold text-gray-900'>🇮🇳 India Regulatory Compliance</h1>
        <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
          Baghpat, UP Operations
        </Badge>
      </div>

      <Tabs defaultValue='overview' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='fema'>FEMA Reports</TabsTrigger>
          <TabsTrigger value='gst'>GST Compliance</TabsTrigger>
          <TabsTrigger value='sebi'>SEBI On-Ramps</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Monthly Revenue</CardTitle>
                <FileText className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  ₹{complianceSummary.revenue.total.toLocaleString('en-IN')}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Foreign: ₹{complianceSummary.revenue.foreign.toLocaleString('en-IN')} | Domestic:
                  ₹{complianceSummary.revenue.domestic.toLocaleString('en-IN')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>GST Liability</CardTitle>
                <Calculator className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  ₹{complianceSummary.compliance.gstLiability.toLocaleString('en-IN')}
                </div>
                <p className='text-xs text-muted-foreground'>
                  18% on service revenue (₹
                  {complianceSummary.revenue.services.toLocaleString('en-IN')})
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>FEMA Reports</CardTitle>
                <AlertTriangle className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{complianceSummary.compliance.femaReports}</div>
                <p className='text-xs text-muted-foreground'>
                  Required for investments &gt;₹50 lakh
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Alerts */}
          <div className='space-y-2'>
            {complianceSummary.alerts.map((alert: string, index: number) => (
              <Alert key={index} variant='default' className='border-orange-200 bg-orange-50'>
                <AlertTriangle className='h-4 w-4 text-orange-600' />
                <AlertTitle>Compliance Alert</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Sample Transaction Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transaction Compliance Analysis</CardTitle>
              <CardDescription>
                Real-time compliance checking for DAO treasury operations
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {sampleTransactions.map((tx, index) => {
                const compliance = checkCompliance(tx.amount, tx.type);
                return (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex-1'>
                      <div className='font-medium'>{tx.description}</div>
                      <div className='text-sm text-gray-600'>
                        {tx.currency} {tx.amount.toLocaleString('en-IN')} • {tx.type}
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {compliance.length > 0 ? (
                        <Badge variant='secondary' className='bg-yellow-50 text-yellow-800'>
                          {compliance.length} compliance checks
                        </Badge>
                      ) : (
                        <Badge variant='outline' className='bg-green-50 text-green-800'>
                          <CheckCircle className='h-3 w-3 mr-1' />
                          Compliant
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='fema' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>FEMA (Foreign Exchange Management Act) Compliance</CardTitle>
              <CardDescription>
                Required for foreign investments above ₹50 lakh threshold
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <div className='font-medium'>US Solar Equipment Purchase</div>
                    <div className='text-sm text-gray-600'>USDC 65,000 → ₹55,00,000</div>
                    <div className='text-xs text-gray-500'>
                      Purpose: Renewable Energy Infrastructure
                    </div>
                  </div>
                  <Badge className='bg-red-50 text-red-800 border-red-200'>
                    FEMA Report Required
                  </Badge>
                </div>

                <div className='bg-blue-50 p-4 rounded-lg'>
                  <h4 className='font-medium text-blue-900 mb-2'>FEMA Reporting Requirements</h4>
                  <ul className='text-sm text-blue-800 space-y-1'>
                    <li>• Submit within 60 days of transaction</li>
                    <li>• Form FC-TRS (Foreign Currency Transaction Report)</li>
                    <li>• Classification: FDI (Foreign Direct Investment)</li>
                    <li>• Sector: Renewable Energy (100% FDI allowed)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='gst' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>GST (Goods and Services Tax) Management</CardTitle>
              <CardDescription>
                18% GST on DAO services • Uttar Pradesh registration required above ₹20 lakh annual
                turnover
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <h4 className='font-medium'>Service Categories</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span>Grid Management Services</span>
                      <span>18% GST</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Energy Trading Platform</span>
                      <span>18% GST</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Agricultural AI Services</span>
                      <span>18% GST</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>DAO Governance Platform</span>
                      <span>TBD (likely 18%)</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h4 className='font-medium'>Monthly GST Calculation</h4>
                  <div className='bg-gray-50 p-3 rounded'>
                    <div className='text-sm space-y-1'>
                      <div className='flex justify-between'>
                        <span>Service Revenue:</span>
                        <span>₹{serviceRevenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>CGST (9%):</span>
                        <span>₹{(serviceRevenue * 0.09).toLocaleString('en-IN')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>SGST (9%):</span>
                        <span>₹{(serviceRevenue * 0.09).toLocaleString('en-IN')}</span>
                      </div>
                      <div className='flex justify-between font-medium border-t pt-1'>
                        <span>Total GST:</span>
                        <span>₹{(serviceRevenue * 0.18).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sebi' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>SEBI-Registered Crypto On-Ramps</CardTitle>
              <CardDescription>
                Approved exchanges for USDC→INR conversions with regulatory compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium'>CoinDCX</h4>
                    <Badge variant='outline' className='bg-green-50 text-green-700'>
                      SEBI Registered
                    </Badge>
                  </div>
                  <div className='text-sm space-y-1 text-gray-600'>
                    <div>License: SEBI/HO/MIRSD/DOP1/CIR/P/2021/615</div>
                    <div>Daily Limit: ₹1 crore</div>
                    <div>Fees: 0.99%</div>
                    <div>Supported: USDC, USDT, BTC, ETH</div>
                  </div>
                </div>

                <div className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium'>TransFi</h4>
                    <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                      US MSB + India Partner
                    </Badge>
                  </div>
                  <div className='text-sm space-y-1 text-gray-600'>
                    <div>License: MSB-FINCEN-31000225601293</div>
                    <div>Daily Limit: ₹50 lakh</div>
                    <div>Fees: 1.2%</div>
                    <div>Supported: USDC, USDT</div>
                  </div>
                </div>
              </div>

              <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <div className='flex items-start space-x-2'>
                  <AlertTriangle className='h-5 w-5 text-yellow-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium text-yellow-800'>Regulatory Update Required</h4>
                    <p className='text-sm text-yellow-700 mt-1'>
                      Monitor RBI's evolving crypto regulations. Current framework allows
                      business-to-business transactions via registered exchanges. Consider
                      establishing INR treasury buffer for operational expenses to minimize
                      conversion frequency.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
