'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { EXCHANGE_RATES } from '@/lib/format';

export function CurrencySettings() {
  const { options, updateOptions } = useCurrencyDisplay();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Display Preferences</CardTitle>
        <CardDescription>Customize how token and fiat amounts are rendered.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label>Show Fiat Equivalent</Label>
            <p className='text-xs text-muted-foreground max-w-sm'>
              Display approximate fiat value alongside OWP tokens.
            </p>
          </div>
          <Switch
            checked={options.showFiatEquivalent}
            onCheckedChange={(checked) => updateOptions({ showFiatEquivalent: checked })}
          />
        </div>

        <div className='space-y-2'>
          <Label>Fiat Currency</Label>
          <Select
            value={options.fiatCurrency}
            onValueChange={(val) => updateOptions({ fiatCurrency: val as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select currency' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='INR'>Indian Rupee (₹)</SelectItem>
              <SelectItem value='USD'>US Dollar ($)</SelectItem>
              <SelectItem value='EUR'>Euro (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>Decimal Places</Label>
          <Select
            value={options.decimals.toString()}
            onValueChange={(val) => updateOptions({ decimals: parseInt(val) })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Decimals' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>0</SelectItem>
              <SelectItem value='1'>1</SelectItem>
              <SelectItem value='2'>2</SelectItem>
              <SelectItem value='4'>4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='pt-4 border-t'>
          <p className='text-xs text-muted-foreground'>
            Current static rates: 1 OWP = {EXCHANGE_RATES.OWP.INR} INR / {EXCHANGE_RATES.OWP.USD}{' '}
            USD / {EXCHANGE_RATES.OWP.EUR} EUR. Dynamic updates coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
