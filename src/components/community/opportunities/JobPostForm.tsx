'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Briefcase, MapPin, Plus, Save, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// ✅ Import constants/types from their actual source
import {
  CATEGORY_SKILLS,
  CURRENCIES,
  Currency,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JobCategory,
  JobPostingFormData,
  WORK_TYPES,
} from '@/types/jobs'; // 👈 VERIFY THIS PATH
