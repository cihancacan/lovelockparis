import * as React from 'react';
import { Html, Body, Head, Heading, Text, Container, Link, Preview, Section } from '@react-email/components';

interface SoldEmailProps {
  lockId: number;
  earnings: number;
  date: string;
}

export const SoldEmail = ({ lockId, earnings, date }: SoldEmailProps) => (
  <Html>
    <Head />
    <Preview>Cha-ching! You just sold a lock 💰</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Sale Confirmed!</Heading>
        <Text style={text}>
          Good news! Another user just bought your lock on the Love Lock Paris Marketplace.
        </Text>
        
        <Section style={box}>
          <Text style={paragraph}><strong>Sold Lock:</strong> #{lockId}</Text>
          <Text style={paragraph}><strong>Date:</strong> {date}</Text>
          <Text style={amount}>+${earnings.toFixed(2)}</Text>
          <Text style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            (Net amount added to your balance after 20% fees)
          </Text>
        </Section>

        <Section style={center}>
          <Link href="https://lovelockparis.com/dashboard" style={button}>
            View my Balance
          </Link>
        </Section>

        <Text style={footer}>
          © Love Lock Paris - Marketplace
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = { backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' };
const container = { margin: '40px auto', padding: '20px', maxWidth: '480px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' };
const h1 = { color: '#10b981', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' as const, margin: '20px 0' };
const text = { fontSize: '16px', lineHeight: '24px', color: '#334155', textAlign: 'center' as const };
const box = { padding: '20px', backgroundColor: '#ecfdf5', borderRadius: '12px', margin: '20px 0', textAlign: 'center' as const, border: '1px solid #d1fae5' };
const paragraph = { margin: '5px 0', fontSize: '14px', color: '#065f46' };
const amount = { fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '10px 0' };
const center = { textAlign: 'center' as const, marginTop: '30px' };
const button = { backgroundColor: '#0f172a', color: '#fff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' };
const footer = { color: '#94a3b8', fontSize: '12px', marginTop: '30px', textAlign: 'center' as const, borderTop: '1px solid #f1f5f9', paddingTop: '20px' };

export default SoldEmail;
