<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $table = 'wallet_transactions';

    protected $fillable = ['wallet_id', 'type', 'amount', 'method', 'reference', 'meta'];

    protected $casts = [
        'amount' => 'integer',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
}
