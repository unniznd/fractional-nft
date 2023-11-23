import 'package:flutter/material.dart';

void main() {
  runApp(const FractionalNFTApp());
}

class FractionalNFTApp extends StatefulWidget {
  const FractionalNFTApp({super.key});

  @override
  State<FractionalNFTApp> createState() => _FractionalNFTAppState();
}

class _FractionalNFTAppState extends State<FractionalNFTApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fractional NFT',
      home: Container(), // TODO: Add Screens Here
    );
  }
}
