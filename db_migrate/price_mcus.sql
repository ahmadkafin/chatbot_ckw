PGDMP                      }            chatbot_non_nlp    17.5    17.5     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16707    chatbot_non_nlp    DATABASE     q   CREATE DATABASE chatbot_non_nlp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE chatbot_non_nlp;
                     postgres    false            �          0    16809 
   price_mcus 
   TABLE DATA           `   COPY public.price_mcus (id, mcu_id, name, price, is_active, created_at, updated_at) FROM stdin;
    public            
   kafinahmad    false    224   )       �           0    0    price_mcus_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.price_mcus_id_seq', 60, true);
          public            
   kafinahmad    false    223            �   �  x���Ko�@���_1�(��0�#�I�l�ÈG�E7S���1���%5׸iE�-�߁{�9<8�?��q�V��<ufo"c�tD0���}�m����f3�9��� _���L7/ۮ���W���n��.�@��Z����廡M���U�rW�=�MG���L��4�p��,��}n
�S������΍XA�9
[�cs��k���M�uZ��}�mM���n�-Zh}��CKcә�R]�������/fߘ�/`����ᘆ��iz�D/ѽ������҇��q�����h>�\������?�vg���>;�0�.��^�|ȷ�Md#ys�)�T�~��
|o$�'����KF���ٶ^5����C;���@�� T�7�bgZ�v�5�n�%�<鍿*3�$ϴ>�v��c]�7��6�@��&Tf��g5[�Y��	~0�H�����O�y�ՐT�_i���m5�<;�ykC�!ȃ��F~�uJ������p�k*裎i��R����:�8l��:�����-օ����E,� ����H�Wȫ���<����@������i景� 	�a+��r]� �L���$�;�2��&�S�,H|H8β�X�9����H'(���)�~�D���1t�u��R���T�Q��&=��Ln��/c���v�X,~+�H�     