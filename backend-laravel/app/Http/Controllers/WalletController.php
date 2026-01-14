<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\Hash;

class WalletController extends Controller
{
    public function balance(Request $request)
    {
        $user = $request->user();
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        return response()->json(['balance' => $wallet->balance]);
    }

    public function setPin(Request $request)
    {
        $user = $request->user();
        $data = $request->validate(['pinCode' => ['required', 'digits:4']]);
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        $wallet->pin_hash = Hash::make($data['pinCode']);
        $wallet->save();
        return response()->json(['message' => 'Pin set']);
    }

    public function verifyPin(Request $request)
    {
        $user = $request->user();
        $data = $request->validate(['pinCode' => ['required', 'digits:4']]);
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        $ok = $wallet->pin_hash && Hash::check($data['pinCode'], $wallet->pin_hash);
        return response()->json(['ok' => $ok]);
    }

    public function deposit(Request $request)
    {
        $user = $request->user();
        $data = $request->validate(['amount' => ['required', 'numeric', 'min:1'], 'method' => ['nullable', 'string']]);
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        $amount = (int) $data['amount'];
        $wallet->balance += $amount;
        $wallet->save();

        $tx = WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'deposit',
            'amount' => $amount,
            'method' => $data['method'] ?? null,
        ]);

        return response()->json(['balance' => $wallet->balance, 'transaction' => $tx]);
    }

    public function transactions(Request $request)
    {
        $user = $request->user();
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        $tx = $wallet->transactions()->latest()->get();
        return response()->json($tx);
    }
}
