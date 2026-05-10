import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button } from '@react-email/components';

type WelcomeEmailProps = {
  firstName?: string | null;
  email: string;
};

export function WelcomeEmail({ firstName, email }: WelcomeEmailProps) {
  const name = firstName || 'there';

  return (
    <Html>
      <Head />
      <Preview>Welcome to LoveLockParis</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Text style={brand}>LoveLockParis</Text>
            <Heading style={title}>Welcome, {name}</Heading>
            <Text style={paragraph}>
              Your LoveLockParis account has been created successfully.
            </Text>
            <Text style={paragraph}>
              You can now create a digital love lock, manage your locks, add memories, and access your dashboard anytime.
            </Text>
            <Button href="https://lovelockparis.com/dashboard" style={button}>
              Open My Dashboard
            </Button>
            <Text style={small}>Account email: {email}</Text>
            <Text style={footer}>
              Need help? Reply to this email or contact support@lovelockparis.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

const main = { backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '32px 16px', maxWidth: '560px' };
const card = { backgroundColor: '#ffffff', borderRadius: '24px', padding: '36px 30px', textAlign: 'center' as const };
const brand = { color: '#e11d48', fontSize: '13px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' as const, margin: '0 0 14px' };
const title = { color: '#0f172a', fontSize: '32px', lineHeight: '38px', margin: '0 0 18px' };
const paragraph = { color: '#334155', fontSize: '16px', lineHeight: '25px', margin: '0 0 14px' };
const button = { display: 'block', backgroundColor: '#e11d48', color: '#ffffff', fontSize: '16px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' as const, borderRadius: '999px', padding: '14px 22px', margin: '26px auto', width: '230px' };
const small = { color: '#64748b', fontSize: '13px', margin: '0 0 20px' };
const footer = { color: '#64748b', fontSize: '13px', lineHeight: '20px', margin: '24px 0 0' };
