import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Button } from '@react-email/components';

type PurchaseEmailProps = {
  lockId: number;
  price: number;
  date: string;
};

export function PurchaseEmail({ lockId, price, date }: PurchaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your LoveLockParis order is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandSection}>
            <Text style={brand}>LoveLockParis</Text>
            <Heading style={title}>Your love lock is confirmed</Heading>
            <Text style={subtitle}>Thank you for creating a digital love lock in Paris.</Text>
          </Section>

          <Section style={card}>
            <Text style={label}>Lock number</Text>
            <Text style={lockNumber}>#{lockId}</Text>
            <Hr style={hr} />
            <Text style={row}>Order date: <strong>{date}</strong></Text>
            <Text style={row}>Amount paid: <strong>${price.toFixed(2)}</strong></Text>
          </Section>

          <Text style={paragraph}>
            Your digital lock is being secured on the LoveLockParis registry. You can create or log into your account to manage your lock, add media, and access your dashboard.
          </Text>

          <Button href="https://lovelockparis.com/dashboard" style={button}>
            Open Dashboard
          </Button>

          <Text style={footer}>
            Need help? Reply to this email or contact support@lovelockparis.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PurchaseEmail;

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '32px 16px',
  maxWidth: '560px',
};

const brandSection = {
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
  borderRadius: '24px 24px 0 0',
  padding: '32px 28px 20px',
};

const brand = {
  color: '#e11d48',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  margin: '0 0 14px',
};

const title = {
  color: '#0f172a',
  fontSize: '30px',
  lineHeight: '36px',
  margin: '0',
};

const subtitle = {
  color: '#64748b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0 0',
};

const card = {
  backgroundColor: '#ffffff',
  padding: '24px 28px',
  borderTop: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0',
};

const label = {
  color: '#64748b',
  fontSize: '13px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0',
};

const lockNumber = {
  color: '#e11d48',
  fontSize: '34px',
  fontWeight: '800',
  margin: '8px 0 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '22px 0',
};

const row = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '8px 0',
};

const paragraph = {
  backgroundColor: '#ffffff',
  color: '#334155',
  fontSize: '16px',
  lineHeight: '25px',
  margin: '0',
  padding: '24px 28px',
};

const button = {
  display: 'block',
  backgroundColor: '#e11d48',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  borderRadius: '999px',
  padding: '14px 22px',
  margin: '24px auto',
  width: '220px',
};

const footer = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '24px 0 0',
};
